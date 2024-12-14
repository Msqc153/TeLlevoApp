import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime',
  standalone: true
})
export class SecondsToTimePipe implements PipeTransform {

  transform(value: number): string {
    if (!value && value !== 0) return '00:00'; // Manejo de valores nulos o no definidos

    const minutes: number = Math.floor(value / 60); // Calcula los minutos
    const seconds: number = value % 60; // Calcula los segundos restantes

    return `${this.pad(minutes)}:${this.pad(seconds)}`; // Devuelve en formato MM:SS
  }

  // Método auxiliar para formatear números de un dígito como '01', '02', etc.
  private pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
