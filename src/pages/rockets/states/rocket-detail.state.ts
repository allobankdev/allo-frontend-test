import type { RocketEntity } from '@/core/entities/rocket.entity';

export class RocketDetailState {
  selectedRocket: RocketEntity | null = null;
  isLoading: boolean = false;
  isError: boolean = false;
  errorMessage: string = '';

  constructor() {
    this.selectedRocket = null;
    this.isLoading = false;
    this.isError = false;
    this.errorMessage = '';
  }
}
