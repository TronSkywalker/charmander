import { Injectable, OnModuleInit } from '@nestjs/common';
import { InfluxService } from 'src/influx/influx.service';
import * as os from 'os';

@Injectable()
export class MetricsService implements OnModuleInit {
  constructor(private readonly influxService: InfluxService) {}

  async logMetrics() {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const loadAvg = os.loadavg();

    await this.influxService.writeMetric(
      'metrics',
      {
        rss: memoryUsage.rss / 1024 / 1024, // Resident Set Size (MB)
        heapTotal: memoryUsage.heapTotal / 1024 / 1024,
        heapUsed: memoryUsage.heapUsed / 1024 / 1024,
        cpuUsed: cpuUsage.system,
        load1: loadAvg[0], // Load average over 1 minutea
        load5: loadAvg[1], // Load average over 5 minutes
        load15: loadAvg[2], // Load average over 15 minutes
      },
      { service: 'nestjs-app' }
    );
  }

  onModuleInit() {
    setInterval(() => this.logMetrics(), 5000); // Log metrics every 5 seconds
  }
}
