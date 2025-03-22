import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TimeSeriesService {
  private influxDB: InfluxDB;
  private org: string;
  private bucket: string;

  private readonly logger = new Logger(TimeSeriesService.name);


  constructor(private configService: ConfigService) {
    this.influxDB = new InfluxDB({
      url: this.configService.get<string>('INFLUXDB_URL'),
      token: this.configService.get<string>('INFLUXDB_TOKEN'),
    });
    this.org = 'your-organization';
    this.bucket = 'your-bucket';
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async generateAndSendData() {
    const point = new Point('sensor_data')
      .tag('location', 'room1')
      .floatField('temperature', this.generateRandomTemperature())
      .timestamp(new Date());
    
    
    this.logger.log(point);
    const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);
    writeApi.writePoint(point);
    await writeApi.close();

    console.log('Data point sent to InfluxDB');
  }

  private generateRandomTemperature(): number {
    return Math.random() * (30 - 20) + 20; // Random temperature between 20 and 30
  }
}
