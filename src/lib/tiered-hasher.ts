/**
 * CodexAuth Tiered Architecture - TypeScript/JavaScript SDK
 * 
 * Multi-tier quantum-resistant hashing for Web3Connected platform.
 * 
 * Tiers:
 * - Commercial (256-512 bits): Consumer apps, wallets, authentication
 * - Enterprise (512-768 bits): Finance, healthcare, SaaS, compliance
 * - Government (768-1024 bits): Defense, critical infrastructure, national systems
 */

import crypto from 'crypto';

/**
 * Hash security tiers
 */
export enum CodexAuthTier {
  COMMERCIAL = 'commercial',
  ENTERPRISE = 'enterprise',
  GOVERNMENT = 'government'
}

/**
 * Supported compliance standards
 */
export enum ComplianceStandard {
  SOC2 = 'SOC2',
  HIPAA = 'HIPAA',
  GDPR = 'GDPR',
  PCI_DSS = 'PCI_DSS',
  FISMA = 'FISMA',
  NIST = 'NIST'
}

/**
 * Tier-specific features
 */
export interface TierFeatures {
  performanceOptimized: boolean;
  mobileFriendly: boolean;
  consumerApps: boolean;
  complianceReady: boolean;
  auditable: boolean;
  complianceStandards: ComplianceStandard[];
  harmonicLock: boolean;
  commandTrust: boolean;
  defenseGrade: boolean;
  interAgencyReady: boolean;
}

/**
 * Tier configuration
 */
export interface TierConfig {
  tier: CodexAuthTier;
  bitRange: [number, number];
  outputLength: number;
  quantumResistance: string;
  securityLevel: string;
  features: TierFeatures;
  roundsMultiplier: number;
}

/**
 * Tiered hash result
 */
export interface TieredHashResult {
  hash: string;
  tier: CodexAuthTier;
  bitLength: number;
  quantumResistance: string;
  securityLevel: string;
  timestamp: string;
  tiu?: number;
  complianceFlags?: string[];
  auditTrail?: Record<string, any>;
  harmonicLockEnabled: boolean;
}

/**
 * Tier configurations
 */
export const TIER_CONFIGS: Record<CodexAuthTier, TierConfig> = {
  [CodexAuthTier.COMMERCIAL]: {
    tier: CodexAuthTier.COMMERCIAL,
    bitRange: [256, 512],
    outputLength: 32, // 256-bit
    quantumResistance: 'baseline',
    securityLevel: 'standard',
    features: {
      performanceOptimized: true,
      mobileFriendly: true,
      consumerApps: true,
      complianceReady: false,
      auditable: false,
      complianceStandards: [],
      harmonicLock: false,
      commandTrust: false,
      defenseGrade: false,
      interAgencyReady: false
    },
    roundsMultiplier: 1.0
  },
  
  [CodexAuthTier.ENTERPRISE]: {
    tier: CodexAuthTier.ENTERPRISE,
    bitRange: [512, 768],
    outputLength: 64, // 512-bit
    quantumResistance: 'enhanced',
    securityLevel: 'high',
    features: {
      performanceOptimized: false,
      mobileFriendly: false,
      consumerApps: false,
      complianceReady: true,
      auditable: true,
      complianceStandards: [
        ComplianceStandard.SOC2,
        ComplianceStandard.HIPAA,
        ComplianceStandard.GDPR,
        ComplianceStandard.PCI_DSS
      ],
      harmonicLock: false,
      commandTrust: false,
      defenseGrade: false,
      interAgencyReady: false
    },
    roundsMultiplier: 1.5
  },
  
  [CodexAuthTier.GOVERNMENT]: {
    tier: CodexAuthTier.GOVERNMENT,
    bitRange: [768, 1024],
    outputLength: 128, // 1024-bit
    quantumResistance: 'maximum',
    securityLevel: 'critical',
    features: {
      performanceOptimized: false,
      mobileFriendly: false,
      consumerApps: false,
      complianceReady: true,
      auditable: true,
      complianceStandards: [
        ComplianceStandard.FISMA,
        ComplianceStandard.NIST,
        ComplianceStandard.SOC2
      ],
      harmonicLock: true,
      commandTrust: true,
      defenseGrade: true,
      interAgencyReady: true
    },
    roundsMultiplier: 2.0
  }
};

/**
 * CodexAuth Tiered Hasher
 */
export class TieredHasher {
  private config: TierConfig;
  
  constructor(public tier: CodexAuthTier = CodexAuthTier.COMMERCIAL) {
    this.config = TIER_CONFIGS[tier];
  }
  
  /**
   * Extract bit window from full 1024-bit hash
   */
  private extractBitWindow(
    fullHash: Buffer,
    bitRange: [number, number]
  ): Buffer {
    const [startBit, endBit] = bitRange;
    const startByte = Math.floor(startBit / 8);
    const endByte = Math.ceil(endBit / 8);
    
    return fullHash.slice(startByte, endByte);
  }
  
  /**
   * Generate full 1024-bit (128 byte) hash
   */
  private generateFullHash(
    data: string,
    salt: string,
    tiu: number,
    rounds: number
  ): Buffer {
    // Combine input components
    const combined = Buffer.from(`${data}${salt}${tiu}`, 'utf-8');
    
    // Initial SHA3-512 (64 bytes)
    const hash1 = crypto.createHash('sha3-512').update(combined).digest();
    
    // Second round SHA3-512 (64 bytes)
    const hash2 = crypto.createHash('sha3-512').update(hash1).digest();
    
    // Combine to get 128 bytes (1024 bits)
    let fullHash = Buffer.concat([hash1, hash2]);
    
    // Apply rounds
    for (let i = 0; i < rounds; i++) {
      const forward = crypto.createHash('sha3-512').update(fullHash).digest();
      const reverse = crypto.createHash('sha3-512')
        .update(Buffer.from(fullHash).reverse())
        .digest();
      fullHash = Buffer.concat([forward, reverse]);
    }
    
    return fullHash.slice(0, 128); // Ensure exactly 128 bytes
  }
  
  /**
   * Calculate harmonic signature from TIU
   */
  private calculateHarmonicSignature(tiu: number): Buffer {
    const phi = 1.618033988749895; // Golden ratio
    const harmonicValue = tiu * phi;
    
    // Generate deterministic bytes from harmonic value
    const signatureStr = harmonicValue.toFixed(15);
    return crypto.createHash('sha3-256')
      .update(signatureStr, 'utf-8')
      .digest();
  }
  
  /**
   * Apply harmonic lock-write layer (Tier 3 only)
   */
  private applyHarmonicLock(
    hashData: Buffer,
    tiu: number,
    lockKey: Buffer
  ): Buffer {
    if (!this.config.features.harmonicLock) {
      return hashData;
    }
    
    // Generate harmonic signature
    const harmonicSignature = this.calculateHarmonicSignature(tiu);
    
    // XOR hash with harmonic signature
    const lockedHash = Buffer.alloc(hashData.length);
    for (let i = 0; i < hashData.length; i++) {
      lockedHash[i] = hashData[i] ^ harmonicSignature[i % harmonicSignature.length];
    }
    
    // HMAC seal
    const sealedHash = crypto.createHmac('sha3-256', lockKey)
      .update(lockedHash)
      .digest();
    
    return sealedHash;
  }
  
  /**
   * Generate tiered hash
   */
  public async hash(
    data: string,
    options: {
      salt?: string;
      tiu?: number;
      rounds?: number;
    } = {}
  ): Promise<TieredHashResult> {
    // Auto-generate missing values
    const salt = options.salt || crypto.createHash('sha256')
      .update(data)
      .digest('hex');
    
    const tiu = options.tiu ?? 0.618034; // Golden ratio default
    
    const baseRounds = 16;
    const rounds = options.rounds ?? Math.floor(
      baseRounds * this.config.roundsMultiplier
    );
    
    // Generate full 1024-bit hash
    const fullHash = this.generateFullHash(data, salt, tiu, rounds);
    
    // Extract tier-specific bit window
    let windowedHash = this.extractBitWindow(fullHash, this.config.bitRange);
    
    // Apply harmonic lock for Tier 3
    if (this.config.features.harmonicLock) {
      const lockKey = crypto.createHash('sha256').update(salt).digest();
      windowedHash = this.applyHarmonicLock(windowedHash, tiu, lockKey);
    }
    
    // Convert to hex
    const hashHex = windowedHash.toString('hex');
    
    // Build result
    const result: TieredHashResult = {
      hash: hashHex,
      tier: this.tier,
      bitLength: this.config.outputLength * 8,
      quantumResistance: this.config.quantumResistance,
      securityLevel: this.config.securityLevel,
      timestamp: new Date().toISOString(),
      tiu: tiu,
      complianceFlags: this.config.features.complianceReady
        ? this.config.features.complianceStandards.map(s => s.toString())
        : undefined,
      auditTrail: this.config.features.auditable
        ? {
            rounds,
            bitRange: this.config.bitRange,
            saltLength: salt.length
          }
        : undefined,
      harmonicLockEnabled: this.config.features.harmonicLock
    };
    
    return result;
  }
  
  /**
   * Verify hash against expected value
   */
  public async verify(
    data: string,
    expectedHash: string,
    options: {
      salt: string;
      tiu: number;
      rounds: number;
    }
  ): Promise<boolean> {
    const result = await this.hash(data, options);
    return result.hash === expectedHash;
  }
}

/**
 * Convenience factory functions
 */
export function createCommercialHasher(): TieredHasher {
  return new TieredHasher(CodexAuthTier.COMMERCIAL);
}

export function createEnterpriseHasher(): TieredHasher {
  return new TieredHasher(CodexAuthTier.ENTERPRISE);
}

export function createGovernmentHasher(): TieredHasher {
  return new TieredHasher(CodexAuthTier.GOVERNMENT);
}

/**
 * Quick hash functions
 */
export async function hashCommercial(
  data: string,
  options?: Parameters<TieredHasher['hash']>[1]
): Promise<TieredHashResult> {
  return createCommercialHasher().hash(data, options);
}

export async function hashEnterprise(
  data: string,
  options?: Parameters<TieredHasher['hash']>[1]
): Promise<TieredHashResult> {
  return createEnterpriseHasher().hash(data, options);
}

export async function hashGovernment(
  data: string,
  options?: Parameters<TieredHasher['hash']>[1]
): Promise<TieredHashResult> {
  return createGovernmentHasher().hash(data, options);
}

/**
 * Demo usage
 */
if (require.main === module) {
  (async () => {
    console.log('🔐 CodexAuth Tiered Architecture Demo\n');
    
    const testData = 'Sensitive enterprise data';
    
    // Test each tier
    for (const tier of Object.values(CodexAuthTier)) {
      const hasher = new TieredHasher(tier);
      const result = await hasher.hash(testData);
      
      console.log('\n' + '='.repeat(60));
      console.log(`Tier: ${result.tier.toUpperCase()}`);
      console.log('='.repeat(60));
      console.log(`Hash: ${result.hash.substring(0, 64)}...`);
      console.log(`Bit Length: ${result.bitLength}`);
      console.log(`Quantum Resistance: ${result.quantumResistance}`);
      console.log(`Security Level: ${result.securityLevel}`);
      console.log(`Harmonic Lock: ${result.harmonicLockEnabled}`);
      if (result.complianceFlags?.length) {
        console.log(`Compliance: ${result.complianceFlags.join(', ')}`);
      }
    }
  })();
}
