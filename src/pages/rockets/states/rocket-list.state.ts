import type { RocketEntity } from '@/core/entities/rocket.entity';

export class RocketListState {
  rockets: RocketEntity[] = [];
  isLoading: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor() {
    this.rockets = [];
    this.isLoading = false;
    this.isError = false;
    this.errorMessage = '';
  }
}
