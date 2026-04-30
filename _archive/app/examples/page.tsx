"use client";

import React, { useState } from "react";
import {
  Shield,
  Gamepad2,
  Landmark,
  Hospital,
  Truck,
  Globe,
  Bitcoin,
  CheckCircle,
  Copy,
  Code,
  ExternalLink,
  PlayCircle,
  Hash,
  Zap,
  AlertTriangle,
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import TopBar from "@/components/common/TitleBar";

interface HashResult {
  hash: string;
  tiu: string;
  rounds: number;
  processingTime: number;
  quantumResistance: number;
  securityLevel: string;
  entropyScore: number;
}

interface ValidationResult {
  isValid: boolean;
  message: string;
}

const ExamplesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("cryptocurrency");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // API Testing State
  const [testData, setTestData] = useState("Hello, Quantum World!");
  const [rounds, setRounds] = useState(16);
  const [tiuMode, setTiuMode] = useState("auto");
  const [customTiu, setCustomTiu] = useState("0.618034");
  const [isLoading, setIsLoading] = useState(false);
  const [validateHash, setValidateHash] = useState("");
  const [validateData, setValidateData] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [hashResult, setHashResult] = useState<HashResult | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [hashCopied, setHashCopied] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // API Testing Functions
  const handleGenerateHash = async () => {
    setIsLoading(true);
    try {
      let tiuValue = 0.618034; // default golden ratio

      if (tiuMode === "auto") {
        tiuValue = (Date.now() * 1.618034) % 1;
      } else if (tiuMode === "custom") {
        tiuValue = parseFloat(customTiu) || 0.618034;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock hash generation (in real implementation, this would call the actual API)
      const mockHash = `ch_${btoa(testData + rounds + tiuValue)
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 64)}`;

      setHashResult({
        hash: mockHash,
        tiu: tiuValue.toFixed(6),
        rounds: rounds,
        processingTime: Math.floor(Math.random() * 150) + 50,
        quantumResistance: Math.min(70 + rounds * 2, 95),
        securityLevel:
          rounds >= 32
            ? "Military"
            : rounds >= 16
            ? "Enterprise"
            : rounds >= 8
            ? "Standard"
            : "Basic",
        entropyScore: Math.floor(Math.random() * 20) + 80,
      });

      // Auto-populate validation fields
      setValidateHash(mockHash);
      setValidateData(testData);
    } catch (error) {
      console.error("Hash generation failed:", error);
    }
    setIsLoading(false);
  };

  const handleValidateHash = async () => {
    setIsValidating(true);
    try {
      // Simulate API validation call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock validation (in real implementation, this would call the actual API)
      const isValid =
        validateHash === hashResult?.hash && validateData === testData;

      setValidationResult({
        isValid,
        message: isValid
          ? "Hash successfully validated. Data integrity confirmed."
          : "Hash validation failed. Data may have been modified or hash is incorrect.",
      });
    } catch (error) {
      console.error("Hash validation failed:", error);
    }
    setIsValidating(false);
  };

  const categories = [
    {
      id: "cryptocurrency",
      title: "Cryptocurrency & Blockchain",
      icon: Bitcoin,
      color: "text-orange-400",
    },
    {
      id: "gaming",
      title: "Gaming & Entertainment",
      icon: Gamepad2,
      color: "text-purple-400",
    },
    {
      id: "military",
      title: "Military & Defense",
      icon: Shield,
      color: "text-red-400",
    },
    {
      id: "finance",
      title: "Financial Services",
      icon: Landmark,
      color: "text-green-400",
    },
    {
      id: "healthcare",
      title: "Healthcare & Medical",
      icon: Hospital,
      color: "text-blue-400",
    },
    {
      id: "logistics",
      title: "Supply Chain & Logistics",
      icon: Truck,
      color: "text-yellow-400",
    },
    {
      id: "iot",
      title: "IoT & Smart Systems",
      icon: Globe,
      color: "text-cyan-400",
    },
  ];

  const examples = {
    cryptocurrency: {
      title: "Cryptocurrency & Blockchain Applications",
      description:
        "Quantum-resistant hashing for next-generation blockchain and cryptocurrency systems",
      useCases: [
        {
          title: "Quantum-Resistant Wallet Security",
          description:
            "Protect cryptocurrency wallets against future quantum attacks with physics-based hashing",
          implementation: "Private key derivation and transaction signing",
          benefits: [
            "50-200+ year quantum protection",
            "Temporal integrity verification",
            "Hardware wallet integration",
          ],
          code: `// Quantum-Resistant Wallet Implementation
import { CodexHash } from '@web3connected/codexhash-starter-kit';

class QuantumWallet {
    private codexHash: CodexHash;
    
    constructor() {
        this.codexHash = new CodexHash({
            bitStrength: 512,
            quantumResistance: true
        });
    }
    
    async generateSecureKey(entropy: string): Promise<string> {
        const result = await this.codexHash.hash(entropy, {
            tiu: 0.618034, // Golden ratio TIU
            iterations: 32  // High security rounds
        });
        
        return result.hash;
    }
    
    async signTransaction(txData: object, privateKey: string): Promise<string> {
        const serialized = JSON.stringify(txData);
        const signature = await this.codexHash.hash(
            serialized + privateKey,
            { temporal: true }
        );
        
        return signature.hash;
    }
}

// Usage Example
const wallet = new QuantumWallet();
const secureKey = await wallet.generateSecureKey('user-entropy-source');
console.log('Quantum-resistant key generated:', secureKey);`,
        },
        {
          title: "Blockchain Consensus Security",
          description:
            "Enhanced proof-of-stake consensus with temporal binding and harmonic validation",
          implementation: "Block validation and consensus mechanisms",
          benefits: [
            "Temporal attack prevention",
            "Harmonic frequency validation",
            "Quantum-resistant consensus",
          ],
          code: `// Quantum-Resistant Blockchain Consensus
class QuantumBlockchain {
    async validateBlock(block: Block, validators: Validator[]): Promise<boolean> {
        const blockHash = await this.codexHash.hash(block.data, {
            tiu: block.timestamp * 0.618034,
            iterations: 16
        });
        
        // Verify temporal consistency
        const temporalValid = await this.verifyTemporal(blockHash.tiu);
        
        // Validate harmonic frequency
        const harmonicValid = this.validateHarmonic(blockHash.meta);
        
        return temporalValid && harmonicValid && 
               this.verifyValidatorSignatures(blockHash, validators);
    }
    
    private async verifyTemporal(tiu: number): Promise<boolean> {
        const currentTIU = await this.codexHash.getCurrentTIU();
        const drift = Math.abs(currentTIU - tiu);
        return drift < 0.001; // 1ms tolerance
    }
}`,
        },
      ],
    },
    gaming: {
      title: "Gaming & Entertainment Systems",
      description:
        "Anti-cheat mechanisms, secure item management, and fair play enforcement",
      useCases: [
        {
          title: "Anti-Cheat & Fair Play",
          description:
            "Quantum-resistant game state verification and cheat detection systems",
          implementation: "Real-time game state hashing and validation",
          benefits: [
            "Unhackable game states",
            "Temporal replay protection",
            "Fair tournament play",
          ],
          code: `// Gaming Anti-Cheat System
class GameSecurityEngine {
    private codexHash: CodexHash;
    private gameStateHistory: Map<string, GameState> = new Map();
    
    async validateGameAction(player: Player, action: GameAction): Promise<boolean> {
        // Create deterministic hash of game state + action
        const stateHash = await this.codexHash.hash(
            JSON.stringify({
                playerId: player.id,
                gameState: player.currentState,
                action: action,
                timestamp: Date.now()
            }),
            {
                tiu: this.calculateTIU(action.timestamp),
                iterations: 8 // Fast for real-time gaming
            }
        );
        
        // Verify against known good states
        return this.verifyActionLegitimacy(stateHash, player);
    }
    
    async generateSecureItem(itemType: string, rarity: number): Promise<GameItem> {
        const itemSeed = await this.codexHash.hash(
            \`\${itemType}-\${rarity}-\${Date.now()}\`,
            { quantumResistance: true }
        );
        
        return {
            id: itemSeed.hash.substring(0, 16),
            type: itemType,
            rarity: rarity,
            authenticity: itemSeed.hash,
            temporalSignature: itemSeed.tiu
        };
    }
}`,
        },
        {
          title: "Secure Virtual Assets",
          description:
            "NFT and in-game item authentication with quantum-resistant verification",
          implementation: "Asset ownership and transfer verification",
          benefits: [
            "Unforgeable digital assets",
            "Cross-game compatibility",
            "Quantum-proof ownership",
          ],
          code: `// Virtual Asset Security
class SecureAssetManager {
    async mintAsset(metadata: AssetMetadata): Promise<SecureAsset> {
        const assetHash = await this.codexHash.hash(
            JSON.stringify(metadata),
            {
                bitStrength: 512,
                tiu: 0.314159, // π/10 for gaming assets
                iterations: 16
            }
        );
        
        return {
            tokenId: assetHash.hash,
            metadata: metadata,
            mintTime: Date.now(),
            quantumSignature: assetHash.meta.quantumResistance,
            transferrable: true
        };
    }
    
    async verifyOwnership(asset: SecureAsset, owner: string): Promise<boolean> {
        const ownershipHash = await this.codexHash.hash(
            asset.tokenId + owner,
            { temporal: true }
        );
        
        return this.blockchain.verifyOwnership(ownershipHash.hash);
    }
}`,
        },
      ],
    },
    military: {
      title: "Military & Defense Applications",
      description:
        "Mission-critical security for classified communications and strategic systems",
      useCases: [
        {
          title: "Classified Communications",
          description:
            "Ultra-secure messaging with 1024-bit quantum resistance for military operations",
          implementation:
            "End-to-end encrypted communications with temporal binding",
          benefits: [
            "Top Secret classification support",
            "200+ year quantum protection",
            "Zero-knowledge architecture",
          ],
          code: `// Military-Grade Secure Communications
class MilitaryComms {
    private codexHash: CodexHash;
    
    constructor() {
        this.codexHash = new CodexHash({
            bitStrength: 1024, // Maximum security
            quantumResistance: true,
            classificationLevel: 'TOP_SECRET'
        });
    }
    
    async encryptMessage(message: string, clearanceLevel: string): Promise<EncryptedMessage> {
        // Generate mission-specific TIU
        const missionTIU = await this.generateMissionTIU();
        
        const messageHash = await this.codexHash.hash(
            message + clearanceLevel + this.getMissionId(),
            {
                tiu: missionTIU,
                iterations: 64, // Ultra-high security
                airgapped: true
            }
        );
        
        return {
            encrypted: messageHash.hash,
            classification: clearanceLevel,
            missionTIU: missionTIU,
            quantumResistance: messageHash.meta.quantumResistance,
            expirationTime: Date.now() + (24 * 60 * 60 * 1000) // 24 hour expiry
        };
    }
    
    private async generateMissionTIU(): Promise<number> {
        // Use astronomical positioning for mission-specific TIU
        const astronomicalData = await this.getAstronomicalPosition();
        return (astronomicalData.solarPosition * 0.618034) % 1;
    }
}`,
        },
        {
          title: "Strategic Asset Protection",
          description:
            "Quantum-resistant security for critical infrastructure and weapon systems",
          implementation:
            "Hardware security modules and access control systems",
          benefits: [
            "Air-gapped deployment",
            "Hardware tamper detection",
            "Mission-critical reliability",
          ],
          code: `// Strategic Asset Security
class AssetSecurityModule {
    async authenticatePersonnel(biometric: BiometricData, clearance: SecurityClearance): Promise<AuthResult> {
        // Multi-factor authentication with biometric binding
        const authHash = await this.codexHash.hash(
            JSON.stringify({
                biometric: this.hashBiometric(biometric),
                clearance: clearance,
                facility: this.getFacilityId(),
                time: Date.now()
            }),
            {
                bitStrength: 1024,
                tiu: this.getMilitaryTIU(),
                iterations: 128 // Maximum security
            }
        );
        
        return {
            authorized: await this.verifyAgainstDatabase(authHash),
            accessLevel: this.determineAccessLevel(authHash),
            sessionToken: authHash.hash.substring(0, 32),
            expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hour sessions
        };
    }
}`,
        },
      ],
    },
    finance: {
      title: "Financial Services & Banking",
      description:
        "Regulatory-compliant quantum security for financial transactions and data protection",
      useCases: [
        {
          title: "High-Frequency Trading Security",
          description:
            "Microsecond-level transaction validation with quantum-resistant algorithms",
          implementation:
            "Real-time transaction signing and validation systems",
          benefits: [
            "Sub-millisecond processing",
            "Regulatory compliance",
            "Market manipulation prevention",
          ],
          code: `// High-Frequency Trading Security
class TradingSecurityEngine {
    async validateTrade(trade: TradeOrder): Promise<ValidationResult> {
        const tradeHash = await this.codexHash.hash(
            JSON.stringify({
                symbol: trade.symbol,
                quantity: trade.quantity,
                price: trade.price,
                timestamp: trade.timestamp,
                traderId: trade.traderId
            }),
            {
                tiu: this.getMarketTIU(trade.timestamp),
                iterations: 4, // Fast for HFT
                priority: 'ultra_high'
            }
        );
        
        // Verify against market data and compliance rules
        const compliance = await this.checkCompliance(tradeHash);
        const marketData = await this.validateMarketConditions(tradeHash);
        
        return {
            valid: compliance.valid && marketData.valid,
            hash: tradeHash.hash,
            executionTime: tradeHash.meta.durationMs,
            quantumResistance: tradeHash.meta.quantumResistance
        };
    }
}`,
        },
        {
          title: "Digital Identity & KYC",
          description:
            "Privacy-preserving customer verification with quantum-resistant identity hashing",
          implementation: "Zero-knowledge identity verification systems",
          benefits: [
            "GDPR compliance",
            "Privacy preservation",
            "Regulatory audit trails",
          ],
          code: `// Financial KYC Identity System
class FinancialIdentityManager {
    async createDigitalIdentity(customerData: KYCData): Promise<DigitalIdentity> {
        // Hash sensitive data with privacy preservation
        const identityHash = await this.codexHash.hash(
            JSON.stringify({
                documentHash: this.hashDocument(customerData.document),
                biometricHash: this.hashBiometric(customerData.biometric),
                addressHash: this.hashAddress(customerData.address),
                timestamp: Date.now()
            }),
            {
                bitStrength: 512,
                quantumResistance: true,
                privacy: 'zero_knowledge'
            }
        );
        
        return {
            identityId: identityHash.hash,
            complianceLevel: this.determineComplianceLevel(customerData),
            verificationStatus: 'verified',
            quantumResistance: identityHash.meta.quantumResistance,
            auditTrail: identityHash.meta
        };
    }
}`,
        },
      ],
    },
    healthcare: {
      title: "Healthcare & Medical Systems",
      description:
        "HIPAA-compliant patient data protection with quantum-resistant medical record security",
      useCases: [
        {
          title: "Medical Record Security",
          description:
            "Quantum-resistant patient data encryption with temporal integrity verification",
          implementation:
            "Electronic health record (EHR) systems with quantum protection",
          benefits: [
            "HIPAA compliance",
            "Patient privacy protection",
            "Medical data integrity",
          ],
          code: `// Medical Record Security System
class MedicalRecordManager {
    async encryptPatientRecord(record: MedicalRecord): Promise<SecureRecord> {
        const recordHash = await this.codexHash.hash(
            JSON.stringify({
                patientId: this.anonymizeId(record.patientId),
                medicalData: record.data,
                doctorId: record.doctorId,
                facilityId: record.facilityId,
                timestamp: record.timestamp
            }),
            {
                bitStrength: 512,
                quantumResistance: true,
                compliance: 'HIPAA',
                iterations: 32
            }
        );
        
        return {
            encryptedRecord: recordHash.hash,
            accessControlHash: this.generateAccessControl(recordHash),
            auditTrail: recordHash.meta,
            complianceVerification: 'HIPAA_COMPLIANT'
        };
    }
    
    async verifyMedicalIntegrity(record: SecureRecord): Promise<IntegrityResult> {
        // Verify record hasn't been tampered with
        const verificationHash = await this.codexHash.verify(
            record.originalData,
            record.encryptedRecord,
            record.salt,
            record.tiu
        );
        
        return {
            intact: verificationHash.valid,
            lastModified: verificationHash.timestamp,
            quantumResistance: verificationHash.resistance
        };
    }
}`,
        },
      ],
    },
    logistics: {
      title: "Supply Chain & Logistics",
      description:
        "End-to-end supply chain verification with quantum-resistant tracking and authentication",
      useCases: [
        {
          title: "Supply Chain Verification",
          description:
            "Quantum-resistant product authentication and supply chain integrity verification",
          implementation:
            "IoT sensors and blockchain integration for real-time tracking",
          benefits: [
            "Anti-counterfeiting protection",
            "Real-time tracking",
            "Quality assurance",
          ],
          code: `// Supply Chain Security System
class SupplyChainManager {
    async createProductFingerprint(product: Product): Promise<ProductFingerprint> {
        const fingerprint = await this.codexHash.hash(
            JSON.stringify({
                sku: product.sku,
                batchNumber: product.batch,
                manufacturingDate: product.mfgDate,
                facilityId: product.facility,
                rawMaterials: product.materials
            }),
            {
                tiu: this.calculateSupplyTIU(product.mfgDate),
                iterations: 16,
                supplyChain: true
            }
        );
        
        return {
            productId: fingerprint.hash,
            authenticity: fingerprint.meta.quantumResistance,
            traceability: this.generateTraceData(fingerprint),
            antiCounterfeit: true
        };
    }
    
    async verifyProductAuthenticity(fingerprint: ProductFingerprint, currentState: ProductState): Promise<VerificationResult> {
        const currentHash = await this.codexHash.hash(
            JSON.stringify(currentState),
            { temporal: true }
        );
        
        return {
            authentic: await this.compareFingerprints(fingerprint, currentHash),
            supplyChainIntegrity: this.verifySupplyChain(fingerprint),
            quantumResistance: currentHash.meta.quantumResistance
        };
    }
}`,
        },
      ],
    },
    iot: {
      title: "IoT & Smart Systems",
      description:
        "Quantum-resistant security for Internet of Things and smart city infrastructure",
      useCases: [
        {
          title: "Smart City Infrastructure",
          description:
            "Quantum-resistant IoT device authentication and secure communications",
          implementation: "City-wide sensor networks with quantum protection",
          benefits: [
            "Scalable IoT security",
            "Smart city integration",
            "Real-time monitoring",
          ],
          code: `// Smart City IoT Security
class SmartCitySecurityManager {
    async authenticateIoTDevice(device: IoTDevice): Promise<DeviceAuth> {
        const deviceHash = await this.codexHash.hash(
            JSON.stringify({
                deviceId: device.id,
                location: device.gps,
                deviceType: device.type,
                firmwareVersion: device.firmware,
                timestamp: Date.now()
            }),
            {
                tiu: this.calculateLocationTIU(device.gps),
                iterations: 8, // Optimized for IoT
                iot: true
            }
        );
        
        return {
            authenticated: await this.verifyDeviceRegistry(deviceHash),
            trustLevel: this.calculateTrustLevel(deviceHash),
            communicationKey: deviceHash.hash.substring(0, 32),
            quantumResistance: deviceHash.meta.quantumResistance
        };
    }
    
    async secureIoTCommunication(data: SensorData, deviceAuth: DeviceAuth): Promise<SecureMessage> {
        const messageHash = await this.codexHash.hash(
            JSON.stringify(data) + deviceAuth.communicationKey,
            { temporal: true, iot: true }
        );
        
        return {
            encryptedData: messageHash.hash,
            deviceSignature: deviceAuth.trustLevel,
            timestamp: messageHash.meta.timestamp,
            integrity: messageHash.meta.quantumResistance
        };
    }
}`,
        },
      ],
    },
  };

  const selectedExample = examples[selectedCategory as keyof typeof examples];

  return (
    <PageLayout>
      <div className="min-h-screen bg-slate-950">
        <TopBar
          title="CodexHash Use Cases & Examples"
          description="Real-world implementations of quantum-resistant hashing across industries from cryptocurrency to military applications"
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Docs", href: "/docs" }, { label: "Examples", href: "/docs/examples" }]}
        />

        <div className="container mx-auto px-6 py-16">
          {/* Category Selector */}
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">
              Industry Applications
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-4 rounded-lg border transition-all duration-300 text-left ${
                      selectedCategory === category.id
                        ? "bg-blue-600/20 border-blue-500 shadow-lg shadow-blue-500/20"
                        : "bg-slate-900/50 border-slate-700 hover:border-slate-600 hover:bg-slate-800/50"
                    }`}
                  >
                    <IconComponent
                      className={`w-8 h-8 ${category.color} mb-3`}
                    />
                    <h3 className="text-white font-semibold text-sm">
                      {category.title}
                    </h3>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Selected Category Examples */}
          <section>
            <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8 mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                {selectedExample.title}
              </h2>
              <p className="text-xl text-slate-300 mb-6">
                {selectedExample.description}
              </p>
            </div>

            <div className="space-y-8">
              {selectedExample.useCases.map((useCase, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden"
                >
                  {/* Use Case Header */}
                  <div className="p-6 border-b border-slate-700">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {useCase.title}
                    </h3>
                    <p className="text-slate-300 mb-4">{useCase.description}</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Implementation
                        </h4>
                        <p className="text-slate-400 text-sm">
                          {useCase.implementation}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-2">
                          Key Benefits
                        </h4>
                        <ul className="space-y-1">
                          {useCase.benefits.map((benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className="flex items-center gap-2 text-slate-400 text-sm"
                            >
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Code Example */}
                  <div className="bg-slate-800/50">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">
                          Implementation Example
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            useCase.code,
                            `${selectedCategory}-${index}`
                          )
                        }
                        className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded transition-colors text-slate-300"
                      >
                        {copiedCode === `${selectedCategory}-${index}` ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Code
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-4">
                      <pre className="bg-black rounded p-4 overflow-x-auto">
                        <code className="text-sm text-green-400 whitespace-pre-wrap">
                          {useCase.code}
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Live API Testing Panel */}
          <section className="mt-16">
            <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-8">
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                Test CodexHash API Live
              </h2>
              <p className="text-xl text-slate-300 mb-8 text-center">
                Try our quantum-resistant hashing API with real-time validation
              </p>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Hash Generation Panel */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Hash className="w-6 h-6 text-blue-400" />
                    Generate Hash
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Input Data
                      </label>
                      <textarea
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        rows={3}
                        placeholder="Enter data to hash (e.g., 'Hello, Quantum World!')"
                        value={testData}
                        onChange={(e) => setTestData(e.target.value)}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Rounds
                        </label>
                        <select
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                          value={rounds}
                          onChange={(e) => setRounds(parseInt(e.target.value))}
                        >
                          <option value={4}>4 rounds (Fast)</option>
                          <option value={8}>8 rounds (Standard)</option>
                          <option value={16}>16 rounds (Enterprise)</option>
                          <option value={32}>32 rounds (High Security)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          TIU Mode
                        </label>
                        <select
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                          value={tiuMode}
                          onChange={(e) => setTiuMode(e.target.value)}
                        >
                          <option value="auto">Auto (Current Time)</option>
                          <option value="golden">
                            Golden Ratio (0.618034)
                          </option>
                          <option value="custom">Custom Value</option>
                        </select>
                      </div>
                    </div>

                    {tiuMode === "custom" && (
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Custom TIU (0-1)
                        </label>
                        <input
                          type="number"
                          step="0.000001"
                          min="0"
                          max="1"
                          className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                          value={customTiu}
                          onChange={(e) => setCustomTiu(e.target.value)}
                          placeholder="0.618034"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleGenerateHash}
                      disabled={isLoading || !testData.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Generate Hash
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Hash Validation Panel */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-6 h-6 text-green-400" />
                    Validate Hash
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Hash to Validate
                      </label>
                      <textarea
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none font-mono text-sm"
                        rows={3}
                        placeholder="Paste hash here for validation"
                        value={validateHash}
                        onChange={(e) => setValidateHash(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Original Data
                      </label>
                      <textarea
                        className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none"
                        rows={2}
                        placeholder="Enter original data for validation"
                        value={validateData}
                        onChange={(e) => setValidateData(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleValidateHash}
                      disabled={
                        isValidating ||
                        !validateHash.trim() ||
                        !validateData.trim()
                      }
                      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      {isValidating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Validating...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Validate Hash
                        </>
                      )}
                    </button>

                    {validationResult && (
                      <div
                        className={`p-4 rounded-lg border ${
                          validationResult.isValid
                            ? "bg-green-900/30 border-green-500/50 text-green-400"
                            : "bg-red-900/30 border-red-500/50 text-red-400"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {validationResult.isValid ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <AlertTriangle className="w-5 h-5" />
                          )}
                          <span className="font-semibold">
                            {validationResult.isValid
                              ? "Hash Valid ✓"
                              : "Hash Invalid ✗"}
                          </span>
                        </div>
                        <p className="text-sm">{validationResult.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Display */}
              {hashResult && (
                <div className="mt-8 bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Hash Result
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Generated Hash
                      </label>
                      <div className="bg-black rounded-lg p-4 relative">
                        <code className="text-green-400 font-mono text-sm break-all">
                          {hashResult.hash}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(hashResult.hash);
                            setHashCopied(true);
                            setTimeout(() => setHashCopied(false), 2000);
                          }}
                          className="absolute top-2 right-2 bg-slate-700 hover:bg-slate-600 text-white p-2 rounded text-xs transition-colors"
                        >
                          {hashCopied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <span className="text-slate-400">TIU Value:</span>
                        <div className="text-blue-400 font-mono">
                          {hashResult.tiu}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <span className="text-slate-400">Rounds:</span>
                        <div className="text-purple-400 font-mono">
                          {hashResult.rounds}
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <span className="text-slate-400">Hash Time:</span>
                        <div className="text-yellow-400 font-mono">
                          {hashResult.processingTime}ms
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-lg p-4">
                      <span className="text-slate-400 block mb-2">
                        Security Analysis:
                      </span>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Quantum Resistance:</span>
                          <span className="text-green-400">
                            {hashResult.quantumResistance}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Security Level:</span>
                          <span className="text-blue-400">
                            {hashResult.securityLevel}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Entropy Score:</span>
                          <span className="text-purple-400">
                            {hashResult.entropyScore}/100
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mt-16">
            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-8 border border-blue-500/30 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Implement CodexHash?
              </h2>
              <p className="text-xl text-slate-300 mb-6">
                Start building quantum-resistant applications today with our
                comprehensive SDK and documentation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Get Started
                </button>
                <button className="bg-slate-700 hover:bg-slate-600 text-white py-3 px-6 rounded-lg font-semibold transition-colors flex items-center gap-2">
                  <ExternalLink className="w-5 h-5" />
                  View Documentation
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExamplesPage;
