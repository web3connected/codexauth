/**
 * CodexEthosLattice - Core Ethos and Lattice System for Codex
 *
 * This class provides the foundation for the Codex ethos and lattice systems
 * that are used throughout the CodexSecure authentication framework.
 *
 * Features:
 * - Prime vector generation for cryptographic operations
 * - Harmonic and resonance field calculations (432 Hz based)
 * - Ethos signature generation and verification
 * - Quantum state management for authentication
 * - Zone-specific validation (trust, auth, secure, admin, identity)
 * - Secure hash generation using lattice matrix
 *
 * Ported from Laravel CodexZones package
 *
 * @version 1.0.0
 */

import * as crypto from 'crypto';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface PrimeVector {
  value: number;
  harmonic: number;
  resonance: number;
}

export interface HarmonicBase {
  frequency: number;
  amplitude: number;
  phase: number;
  overtones: number[];
}

export interface ResonanceField {
  field_strength: number;
  coherence: number;
  stability: number;
  entropy: number;
}

export interface LatticeMatrix {
  prime_vectors: PrimeVector[];
  harmonic_base: HarmonicBase;
  resonance_field: ResonanceField;
}

export interface EthosCore {
  integrity: boolean;
  authenticity: boolean;
  harmony: boolean;
  balance: boolean;
}

export interface LatticeCoordinates {
  x: number;
  y: number;
  z?: number;
}

export interface LatticePoint extends LatticeCoordinates {
  z: number;
  energy: number;
  harmonic: number;
  resonance: number;
}

export interface ValidationContext {
  user_id?: string | number;
  tiu?: string;
  hash?: string;
  email?: string;
  device_id?: string;
  device_key?: string;
  trust_score?: number;
  [key: string]: unknown;
}

export interface SuspiciousActivityReport {
  user_identifier: string;
  ip: string;
  user_agent: string;
  timestamp: string;
  zone: string;
}

// ============================================================================
// Zone Constants
// ============================================================================

export const ZONE_TRUST = 'trust' as const;
export const ZONE_AUTH = 'auth' as const;
export const ZONE_SECURE = 'secure' as const;
export const ZONE_ADMIN = 'admin' as const;
export const ZONE_IDENTITY = 'identity' as const;

export type EthosZone = typeof ZONE_TRUST | typeof ZONE_AUTH | typeof ZONE_SECURE | typeof ZONE_ADMIN | typeof ZONE_IDENTITY;

const VALID_ZONES: EthosZone[] = [ZONE_TRUST, ZONE_AUTH, ZONE_SECURE, ZONE_ADMIN, ZONE_IDENTITY];

// ============================================================================
// CodexEthosLattice Class
// ============================================================================

export class CodexEthosLattice {
  // Zone constants (static)
  static readonly ZONE_TRUST = ZONE_TRUST;
  static readonly ZONE_AUTH = ZONE_AUTH;
  static readonly ZONE_SECURE = ZONE_SECURE;
  static readonly ZONE_ADMIN = ZONE_ADMIN;
  static readonly ZONE_IDENTITY = ZONE_IDENTITY;

  // Instance properties
  protected latticeMatrix: LatticeMatrix;
  protected ethosCore: EthosCore;
  protected quantumState: Map<string, string>;

  // Suspicious activity log (in production, use proper logging)
  private suspiciousActivityLog: SuspiciousActivityReport[] = [];

  constructor() {
    this.latticeMatrix = this.initializeLattice();
    this.ethosCore = this.initializeEthos();
    this.quantumState = new Map();
  }

  // ==========================================================================
  // Initialization
  // ==========================================================================

  /**
   * Initialize the lattice matrix
   */
  protected initializeLattice(): LatticeMatrix {
    return {
      prime_vectors: this.generatePrimeVectors(),
      harmonic_base: this.generateHarmonicBase(),
      resonance_field: this.generateResonanceField(),
    };
  }

  /**
   * Initialize the ethos core
   */
  protected initializeEthos(): EthosCore {
    return {
      integrity: true,
      authenticity: true,
      harmony: true,
      balance: true,
    };
  }

  /**
   * Generate prime vectors for the lattice
   */
  protected generatePrimeVectors(): PrimeVector[] {
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    
    return primes.map(prime => ({
      value: prime,
      harmonic: this.calculateHarmonic(prime),
      resonance: this.calculateResonance(prime),
    }));
  }

  /**
   * Generate harmonic base
   */
  protected generateHarmonicBase(): HarmonicBase {
    return {
      frequency: 432, // Hz - Natural harmonic frequency
      amplitude: 1.0,
      phase: 0,
      overtones: [432, 864, 1296, 1728, 2160],
    };
  }

  /**
   * Generate resonance field
   */
  protected generateResonanceField(): ResonanceField {
    return {
      field_strength: 1.0,
      coherence: 0.95,
      stability: 0.98,
      entropy: 0.02,
    };
  }

  // ==========================================================================
  // Harmonic Calculations
  // ==========================================================================

  /**
   * Calculate harmonic for a given value
   */
  protected calculateHarmonic(value: number): number {
    return ((value * 432) % 1000) / 1000;
  }

  /**
   * Calculate resonance for a given value
   */
  protected calculateResonance(value: number): number {
    return Math.sin((value * Math.PI) / 180) * 0.5 + 0.5;
  }

  // ==========================================================================
  // Getters
  // ==========================================================================

  /**
   * Get lattice matrix
   */
  getLatticeMatrix(): LatticeMatrix {
    return { ...this.latticeMatrix };
  }

  /**
   * Get ethos core
   */
  getEthosCore(): EthosCore {
    return { ...this.ethosCore };
  }

  // ==========================================================================
  // Quantum State Management
  // ==========================================================================

  /**
   * Generate quantum state for authentication
   */
  generateQuantumState(seed: string): string {
    const state = crypto
      .createHash('sha256')
      .update(seed + Date.now().toString())
      .digest('hex');
    
    this.quantumState.set(seed, state);
    return state;
  }

  /**
   * Verify quantum state
   */
  verifyQuantumState(seed: string, state: string): boolean {
    const storedState = this.quantumState.get(seed);
    return storedState !== undefined && storedState === state;
  }

  /**
   * Clear quantum state (for cleanup)
   */
  clearQuantumState(seed?: string): void {
    if (seed) {
      this.quantumState.delete(seed);
    } else {
      this.quantumState.clear();
    }
  }

  // ==========================================================================
  // Ethos Signature
  // ==========================================================================

  /**
   * Calculate ethos signature
   */
  calculateEthosSignature(data: string): string {
    const ethosValues = Object.values(this.ethosCore);
    let signature = '';

    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      const ethosIndex = i % ethosValues.length;
      const ethosModifier = ethosValues[ethosIndex] ? 1 : 0;
      signature += ((char + ethosModifier) % 16).toString(16);
    }

    return signature;
  }

  /**
   * Verify ethos signature
   */
  verifyEthosSignature(data: string, signature: string): boolean {
    return this.calculateEthosSignature(data) === signature;
  }

  // ==========================================================================
  // Lattice Point
  // ==========================================================================

  /**
   * Get lattice point for authentication
   */
  getLatticePoint(coordinates: LatticeCoordinates): LatticePoint {
    const x = coordinates.x ?? 0;
    const y = coordinates.y ?? 0;
    const z = coordinates.z ?? 0;

    return {
      x,
      y,
      z,
      energy: Math.sqrt(x * x + y * y + z * z),
      harmonic: this.calculateHarmonic(x + y + z),
      resonance: this.calculateResonance(x * y * z),
    };
  }

  // ==========================================================================
  // Secure Hash
  // ==========================================================================

  /**
   * Generate secure hash using ethos lattice
   */
  generateSecureHash(input: string, salt: string = ''): string {
    const ethosSignature = this.calculateEthosSignature(input);
    const latticeData = JSON.stringify(this.latticeMatrix);
    const combined = input + salt + ethosSignature + latticeData;

    return crypto.createHash('sha512').update(combined).digest('hex');
  }

  /**
   * Verify secure hash
   */
  verifySecureHash(input: string, hash: string, salt: string = ''): boolean {
    return this.generateSecureHash(input, salt) === hash;
  }

  // ==========================================================================
  // Zone Validation
  // ==========================================================================

  /**
   * Validate ethos for a given zone and context
   */
  validate(zone: EthosZone, context: ValidationContext): boolean {
    // Basic validation for the zone
    if (!VALID_ZONES.includes(zone)) {
      throw new Error(`Invalid zone: ${zone}`);
    }

    // Check if required context is provided
    const requiredFields: (keyof ValidationContext)[] = ['user_id', 'tiu', 'hash'];
    for (const field of requiredFields) {
      if (!context[field]) {
        return false;
      }
    }

    // Additional validation based on zone
    switch (zone) {
      case ZONE_TRUST:
        return this.validateTrustZone(context);
      case ZONE_AUTH:
        return this.validateAuthZone(context);
      case ZONE_SECURE:
        return this.validateSecureZone(context);
      case ZONE_ADMIN:
        return this.validateAdminZone(context);
      case ZONE_IDENTITY:
        return this.validateIdentityZone(context);
      default:
        return false;
    }
  }

  /**
   * Validate trust zone context
   */
  protected validateTrustZone(context: ValidationContext): boolean {
    // Check trust score if provided
    if (context.trust_score !== undefined && context.trust_score < 0.5) {
      return false;
    }

    // Validate device context
    if (context.device_id !== undefined && !context.device_id) {
      return false;
    }

    return true;
  }

  /**
   * Validate auth zone context
   */
  protected validateAuthZone(context: ValidationContext): boolean {
    // Auth zone requires valid email format
    if (!context.email) {
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(context.email);
  }

  /**
   * Validate secure zone context
   */
  protected validateSecureZone(context: ValidationContext): boolean {
    // Secure zone requires device_key
    return !!context.device_key;
  }

  /**
   * Validate admin zone context
   */
  protected validateAdminZone(context: ValidationContext): boolean {
    // Admin zone requires highest level of validation
    return (
      this.validateSecureZone(context) &&
      context.trust_score !== undefined &&
      context.trust_score >= 0.8
    );
  }

  /**
   * Validate identity zone context
   */
  protected validateIdentityZone(context: ValidationContext): boolean {
    // Identity zone requires user_id, hash, and tiu
    const requiredFields: (keyof ValidationContext)[] = ['user_id', 'hash', 'tiu'];

    for (const field of requiredFields) {
      if (!context[field]) {
        return false;
      }
    }

    // Additional validation: ensure hash is sufficiently long
    const hash = context.hash as string;
    return hash.length >= 32;
  }

  // ==========================================================================
  // Security Monitoring
  // ==========================================================================

  /**
   * Report suspicious activity
   */
  reportSuspiciousActivity(
    userIdentifier: string,
    ip: string = 'unknown',
    userAgent: string = 'unknown'
  ): void {
    const report: SuspiciousActivityReport = {
      user_identifier: userIdentifier,
      ip,
      user_agent: userAgent,
      timestamp: new Date().toISOString(),
      zone: ZONE_TRUST,
    };

    // Log to internal array (in production, use proper logging service)
    this.suspiciousActivityLog.push(report);

    // Console warning in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Suspicious activity detected:', report);
    }

    // In production, you would:
    // - Send to logging service (e.g., Winston, Pino)
    // - Trigger alerts (e.g., Slack, PagerDuty)
    // - Update rate limiting rules
    // - Add to blocklist if threshold exceeded
  }

  /**
   * Get suspicious activity log (for monitoring)
   */
  getSuspiciousActivityLog(): SuspiciousActivityReport[] {
    return [...this.suspiciousActivityLog];
  }

  /**
   * Clear suspicious activity log
   */
  clearSuspiciousActivityLog(): void {
    this.suspiciousActivityLog = [];
  }

  // ==========================================================================
  // Utility Methods
  // ==========================================================================

  /**
   * Get all valid zones
   */
  static getValidZones(): EthosZone[] {
    return [...VALID_ZONES];
  }

  /**
   * Check if a zone is valid
   */
  static isValidZone(zone: string): zone is EthosZone {
    return VALID_ZONES.includes(zone as EthosZone);
  }

  /**
   * Create a fresh instance
   */
  static create(): CodexEthosLattice {
    return new CodexEthosLattice();
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let ethosLatticeInstance: CodexEthosLattice | null = null;

/**
 * Get singleton instance of CodexEthosLattice
 */
export function getEthosLattice(): CodexEthosLattice {
  if (!ethosLatticeInstance) {
    ethosLatticeInstance = new CodexEthosLattice();
  }
  return ethosLatticeInstance;
}

/**
 * Reset singleton instance (for testing)
 */
export function resetEthosLattice(): void {
  ethosLatticeInstance = null;
}

export default CodexEthosLattice;
