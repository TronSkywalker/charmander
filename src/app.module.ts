import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TimeSeriesService } from './time-series/time-series.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { InfluxService } from './influx/influx.service';
import { MetricsService } from './metrics/metrics.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, TimeSeriesService, InfluxService, MetricsService],
  exports:[InfluxService]
})
export class AppModule {}
