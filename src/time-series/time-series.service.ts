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
    this.org = 'riccus';
    this.bucket = 'init_bucket';
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async generateTemperaturInRooms() {

    const N=8
    //
    const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);

    for (let i=0; i<N; i++) {
        const point = new Point('sensor_data')
            .tag('location', 'room' + i.toString())
            .floatField('temperature', this.generateRandomTemperature())
            .timestamp(new Date());
        writeApi.writePoint(point);
      }
      
    await writeApi.close();
    this.logger.log("new datapoint");
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async generate0to1data() {

    const N=4
    //
    const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);

    for (let i=0; i<N; i++) {
        const point = new Point('sensor_data2')
            .tag('location', 'gage_percent_' + i.toString())
            .floatField('value', this.generate0to1())
            .timestamp(new Date());
        writeApi.writePoint(point);
      }
      
    await writeApi.close();
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async generatesinus0to1data() {

    const N=4
    //
    const writeApi = this.influxDB.getWriteApi(this.org, this.bucket);

    for (let i=0; i<N; i++) {
        const point = new Point('sensor_data3')
            .tag('location', 'gage_percent_' + i.toString())
            .floatField('value', i*Math.sin(new Date().getSeconds()+i))
            .timestamp(new Date());
        writeApi.writePoint(point);
      }
      
    await writeApi.close();
  }


  private generate0to1(): number {
    return Math.random(); // Random temperature between 20 and 30
  }

  private generateRandomTemperature(): number {
    return Math.random() * (30 - 20) + 20; // Random temperature between 20 and 30
  }
}
