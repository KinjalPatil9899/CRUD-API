const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length - 1; // Adjusted to number of available parallelism - 1

const dotenv = require('dotenv');

dotenv.config();

// const PORT = 4000;

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

const PORT = normalizePort(process.env.PORT || '4000');

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });

  let workerIndex = 0;
  const workers = Object.values(cluster.workers);

  // Round-robin load balancing
  const getNextWorker = () => {
    if (workerIndex >= workers.length) {
      workerIndex = 0;
    }
    return workers[workerIndex++];
  };

  // Create load balancer server
  const server = http.createServer((req, res) => {
    const worker = getNextWorker();
    const requestData = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body // You might need to handle request body parsing here
    };
    console.log('requestData-=-=-=-=-', requestData);
    worker.send({ type: 'REQUEST', requestData });
    res.end('Request sent to worker');
  }).listen(PORT, () => {
    console.log(`Load balancer listening on port ${PORT}`);
  });

  // Listen for messages from workers
  workers.forEach(worker => {
    worker.on('message', message => {
      console.log(`Received message from worker ${worker.id}:`, message);
    });
  });
} else {
  // Workers can share any TCP connection
  // In this case, it will be an HTTP server
  const server = http.createServer((req, res) => {
    // Handle request
    res.writeHead(200);
    res.end('Hello World\n');
  });

  // Start worker server
  server.listen(PORT + cluster.worker.id, () => {
    console.log(`Worker ${cluster.worker.id} started listening on port ${PORT + cluster.worker.id}`);
  });

  // Listen for messages from the master
  process.on('message', message => {
    if (message && message.type === 'REQUEST') {
      const { requestData } = message;
      // Here you can handle the request data and process the request accordingly
      console.log(`Worker ${cluster.worker.id} received request:`, requestData);
    }
  });
}