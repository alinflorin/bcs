export interface HealthcheckResponseDto {
  healthy: boolean;
  version: string;
  reason?: string;
}
