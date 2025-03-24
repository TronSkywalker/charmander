import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class InfluxService implements OnModuleInit, OnModuleDestroy {
  private influxDB: InfluxDB;
  private writeApi;

  private readonly ORG = 'riccus';
  private readonly BUCKET = 'service-metrics';

  constructor(private configService: ConfigService) {
    this.influxDB = new InfluxDB({
        url: this.configService.get<string>('INFLUXDB_URL'),
        token: this.configService.get<string>('INFLUXDB_TOKEN'),
      });    
    this.writeApi = this.influxDB.getWriteApi(this.ORG, this.BUCKET, 'ns');
  }

  onModuleInit() {
    console.log('InfluxDB service initialized');
  }

  async writeMetric(measurement: string, fields: Record<string, number>, tags: Record<string, string> = {}) {
    const point = new Point(measurement);

    // Add tags
    Object.entries(tags).forEach(([key, value]) => point.tag(key, value));

    // Add fields
    Object.entries(fields).forEach(([key, value]) => point.floatField(key, value));

    this.writeApi.writePoint(point);
  }

  async flushMetrics() {
    await this.writeApi.flush();
  }

  async onModuleDestroy() {
    await this.flushMetrics();
    await this.writeApi.close();
  }
}
