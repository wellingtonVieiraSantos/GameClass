import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
    getCurrentWeek() {
    const now = new Date()

    const { week, year } = this.getISOWeekAndYear(now)
    const { start, end } = this.getWeekRange(now)

    return {
      week,
      year,
      start: this.formatDate(start),
      end: this.formatDate(end),
    }
  }

  private getISOWeekAndYear(date: Date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))

    const dayNum = d.getUTCDay() || 7 
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)

    const year = d.getUTCFullYear()

    const yearStart = new Date(Date.UTC(year, 0, 1))
    const week = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)

    return { week, year }
  }

  private getWeekRange(date: Date) {
    const d = new Date(date)

    const day = d.getDay() || 7 
    const monday = new Date(d)
    monday.setDate(d.getDate() - day + 1)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    return { start: monday, end: sunday }
  }

  private formatDate(date: Date) {
    return date.toISOString().split('T')[0] 
  }
}
