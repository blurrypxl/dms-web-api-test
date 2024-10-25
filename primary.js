import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

if (cluster.isPrimary) {
  // Spawning workers
  for (let i = 0; i < availableParallelism(); i++) {
    cluster.fork()
  }

  cluster.on('exit', function (worker, code, signal) {
    console.log(`Worker ${worker.process.pid} died`)
    console.log(`Starting another worker`)
    cluster.fork()
  })
}
else {
  import ('./app.js')
}
