/**
 * Local structured answers for NEPRA Chapter 16 / IESCO EVCS compliance questions.
 * Used when OpenAI is unavailable and to give fast deterministic responses.
 * Never exposes credentials or internal system details.
 */

const DISCLAIMER =
  '\n\n*As per available guidance, subject to confirmation from IESCO/NEPRA/NEECA where applicable.*';

/** @returns {string|null} */
export function matchEVCSQuestion(normalized) {
  if (!normalized) return null;

  const n = normalized;
  const matchesAny = (terms) => terms.some((t) => n.includes(t));

  if (
    matchesAny(['transformer', 'kva']) &&
    matchesAny(['size', 'sizing', 'capacity', 'load', 'kw', 'charger'])
  ) {
    return `### Direct Answer
Use **kVA = kW ÷ Power Factor**. For a **120 kW** charger at **0.9 PF**: kVA = 133.33 kVA — a **150 kVA** transformer is practically safer than 100 kVA.

### Detailed Explanation
IESCO/DISCO will verify feeder capacity, existing transformer loading, and site survey results before approving the final transformer size.

### Practical IESCO / NEPRA Compliance Point
Include transformer requirement calculation, load demand calculation, and Single Line Diagram in your submission file.

### Important Note
Final approval depends on IESCO load study, feeder capacity, transformer loading, and site survey.${DISCLAIMER}`;
  }

  if (
    matchesAny(['neeca', 'psqca']) &&
    matchesAny(['license', 'licence', 'before', 'required', 'sequenc', 'application', 'iesco'])
  ) {
    return `### Direct Answer
Your IESCO file should include **NEECA / PSQCA / manufacturer compliance documents** where applicable, but the exact sequencing depends on the relevant authority's process.

### Detailed Explanation
Prepare all technical and compliance documents **before submission** — load calculation, SLD, layout, earthing design, charger datasheet, and compliance certificates.

### Practical IESCO / NEPRA Compliance Point
NEECA registration certificate is recommended/required as per process; weak files missing equipment standard verification are often delayed.

### Important Note
Confirm the latest requirement directly with IESCO/NEECA for your specific case.${DISCLAIMER}`;
  }

  if (
    matchesAny(['document', 'documents', 'checklist', 'file', 'submit', 'submission', 'noc', 'application']) &&
    matchesAny(['iesco', 'evcs', 'ev station', 'charging station', 'connection', 'pevcs', 'chapter 16', 'nepra'])
  ) {
    return `### Direct Answer
For **IESCO EVCS connection/NOC**, prepare three document groups: **Legal**, **Technical**, and **Commercial**.

### Required Documents / Requirements

**A. Legal Documents**
- CNIC / NTN / SECP documents — Required
- Site ownership / lease agreement — Required
- Authority letter (if company representative) — Required
- Existing electricity bill (if any) — Required
- NEECA / registration certificate — Recommended / required as per process

**B. Technical Documents**
- Load demand calculation — Required
- Single Line Diagram (SLD) — Required
- Site layout plan — Required
- Transformer requirement calculation — Required
- Cable sizing calculation — Required
- Earthing design — Required
- Protection scheme — Required
- Charger technical datasheet — Required
- IP / IK rating certificate — Required
- OCPP / smart charging details — Recommended
- Fire safety plan — Required

**C. Commercial Documents**
- Tariff / category acceptance — Required
- Demand notice & security deposit (after IESCO notice) — Required
- Billing display mechanism — Recommended
- EV user invoice format — Recommended

### Practical IESCO / NEPRA Compliance Point
The strongest file clearly shows load demand, site layout, safety protections, earthing design, and transformer/feeder feasibility.

### Important Note
EVConsults can help prepare and review your complete submission file.${DISCLAIMER}`;
  }

  if (
    matchesAny(['step', 'steps', 'process', 'sequence', 'how to get', 'how do i get', 'procedure']) &&
    matchesAny(['iesco', 'connection', 'evcs', 'charging station', 'pevcs'])
  ) {
    return `### Direct Answer
Follow this **14-step sequence** for IESCO EV station connection:

1. Finalize site and charger capacity
2. Prepare load calculation and layout
3. Prepare SLD and earthing/protection design
4. Submit application to IESCO/MIRAD or relevant office
5. IESCO conducts site survey and feasibility
6. IESCO verifies feeder/transformer capacity
7. NOC / technical approval is issued
8. Demand notice is issued
9. Applicant deposits required amount
10. Connection, transformer, meter and service line installed
11. Charger installation inspected
12. Station energized
13. Operator displays tariff/margin and safety instructions
14. Maintain records, testing and complaint handling

### Practical IESCO / NEPRA Compliance Point
Treat this as a **commercial electricity connection** plus NEPRA Chapter 16 safety, tariff, metering and operational requirements.${DISCLAIMER}`;
  }

  if (matchesAny(['earthing', 'grounding', 'earth resistance', 'bonding', '5 ohm', 'ohms'])) {
    return `### Direct Answer
A PEVCS must have a **dedicated earthing/grounding system** with bonding maintained between vehicle and equipment.

### Detailed Explanation
- General earthing resistance should **not exceed 5 ohms**
- Transformer grounding path should **not exceed 2.5 ohms** where applicable
- Critical systems: check every **6 months**
- Testing records retained for **3 years**
- Equipment must have nameplate/tag numbers

### Practical IESCO / NEPRA Compliance Point
Include earthing design in your IESCO submission — heavily reviewed alongside RCCB/RCD/ELCB protection.${DISCLAIMER}`;
  }

  if (
    matchesAny(['protection', 'rccb', 'rcd', 'elcb', 'short circuit', 'overcurrent', 'overvoltage', 'interlock', 'lightning'])
  ) {
    return `### Direct Answer
EVSE must include comprehensive electrical protection per NEPRA Chapter 16.

### Required Protections
- Short-circuit, overcurrent, and overload protection
- Earth leakage protection (mandatory **RCD / RCCB / ELCB**)
- Overvoltage and reverse power flow protection
- Battery overcharging protection
- Lightning protection
- Interlocks — no energization until connected to vehicle

### Practical IESCO / NEPRA Compliance Point
Include a complete **protection scheme** in your technical submission.${DISCLAIMER}`;
  }

  if (matchesAny(['meter', 'metering', 'kwh', 'separate connection'])) {
    return `### Direct Answer
Each PEVCS needs a **separate DISCO-approved commercial connection** with an **IESCO-approved meter** recording kWh accurately.

### Detailed Explanation
- IESCO/DISCO may inspect anytime
- Tampering or wrong billing must be corrected
- Records preserved for **3 years**

### Practical IESCO / NEPRA Compliance Point
Separate metering is a top IESCO approval priority.${DISCLAIMER}`;
  }

  if (
    matchesAny(['tariff', 'billing', 'margin', 'overcharg', 'rate', 'invoice', 'bill format']) &&
    matchesAny(['ev', 'charging', 'pevcs', 'nepra', 'user', 'customer'])
  ) {
    return `### Direct Answer
PEVCS is billed under **Commercial Consumer Category**. Owners may design their own invoice format, but rates must stay within **NEPRA-approved maximum margin**.

### Detailed Explanation
- Rates displayed at site and online if applicable
- Users must see kWh, rate, and total amount
- Overcharging may be reported to NEPRA with penalties
- Tariff violations → NEPRA; wrong DISCO bill → IESCO/DISCO

### Practical IESCO / NEPRA Compliance Point
Display tariff/margin prominently before going live.${DISCLAIMER}`;
  }

  if (
    matchesAny(['site survey', 'feasibility', 'feeder', 'survey']) ||
    (matchesAny(['transformer', 'feeder']) && matchesAny(['capacity', 'sufficient', 'support']))
  ) {
    return `### Direct Answer
IESCO/DISCO verifies whether your proposed EV load can be supported on-site.

### What IESCO Verifies
- Feeder capacity for additional EV load
- Existing transformer capacity
- New dedicated transformer if needed
- Service line route safety
- Separate approved meter arrangement
- Safety clearance from hazards
- Earthing system resistance and continuity

### Practical IESCO / NEPRA Compliance Point
Load feasibility is the **#1 approval priority**.${DISCLAIMER}`;
  }

  if (
    matchesAny(['installation', 'ip rating', 'ipx4', 'ip44', 'ip55', 'ik10', 'socket height', '800 mm', 'outdoor', 'extension cord'])
  ) {
    return `### Direct Answer
Installation must follow NEPRA Chapter 16 practical requirements.

### Key Requirements
- No obstruction of footpaths
- Socket at least **800 mm** above ground
- **No extension cord**
- Vehicle impact protection (bollards/barriers)
- Outdoor: **IPX4** minimum (IP44/IP55 where applicable), **IK10** where required
- Safe parking layout for charging access

### Practical IESCO / NEPRA Compliance Point
Include layout plan with parking, charger location, and cable routes.${DISCLAIMER}`;
  }

  if (matchesAny(['petrol pump', 'petrol station', 'gas station', 'fuel station', 'forecourt', 'hazardous zone'])) {
    return `### Direct Answer
EV chargers at petrol pumps must be **outside the hazardous fuel zone**.

### Requirements
- Safety clearance from fuel dispensing zone
- Fire safety system available
- Control unauthorized access
- No traffic obstruction
- Mechanical barriers (bollards) for impact protection

### Practical IESCO / NEPRA Compliance Point
Safe layout away from hazardous zones is a top approval priority.${DISCLAIMER}`;
  }

  if (matchesAny(['fire', 'emergency', 'extinguisher', 'fire alarm', 'shutdown'])) {
    return `### Direct Answer
PEVCS must meet fire and emergency safety per applicable codes.

### Requirements
- Fire detection/alarm where applicable
- Fire extinguisher on site
- Emergency shutdown capability
- Live parts not publicly accessible
- Secure enclosure and lightning protection
- **Fire safety plan** required in IESCO submission${DISCLAIMER}`;
  }

  if (matchesAny(['maintenance', 'inspection', 'calibration', '3 year', 'three year', 'record keeping', 'testing record'])) {
    return `### Direct Answer
Maintain preventive maintenance per manufacturer manual; preserve records for **3 years**.

### Requirements
- Scheduled inspection and testing
- Annual inspection minimum
- Third-party inspection if required
- Fault recording and resolution
- Meter/protection device calibration

### Practical IESCO / NEPRA Compliance Point
Poor records create compliance issues during inspections.${DISCLAIMER}`;
  }

  if (matchesAny(['ocpp', 'smart charging', 'ems', 'energy management', 'network connectivity', 'fault detection'])) {
    return `### Direct Answer
EVSE should support smart operations under NEPRA Chapter 16.

### Operations Requirements
- Smart charging capability
- **OCPP** required/preferred
- EMS integration
- Accurate metering-based billing
- Network connectivity and fault reporting
- Bi-directional vehicle communication
- Clear user safety instructions

### Practical IESCO / NEPRA Compliance Point
OCPP details are **Recommended** in technical submission.${DISCLAIMER}`;
  }

  if (matchesAny(['signage', 'sign', 'danger sign', 'caution sign', 'instructions', 'urdu', 'emergency contact sign'])) {
    return `### Direct Answer
Display clear safety signage and user instructions on site.

### Required Signage
- Danger sign near panel/transformer/hazardous areas
- Caution sign at safety-risk locations
- Safe charging instructions
- Fire safety instructions near extinguisher
- Emergency operator contact
- Urdu, English and/or local language
- Prominent fixed locations${DISCLAIMER}`;
  }

  if (matchesAny(['complaint', 'dispute', 'overbilling', 'violation'])) {
    return `### Direct Answer
| Complaint | Responsible Entity |
|-----------|-------------------|
| Overbilling by EV station | PEVCS owner / NEPRA |
| Wrong DISCO bill | IESCO/DISCO |
| Meter defect | IESCO/DISCO |
| Charging service | PEVCS owner |
| Safety | DISCO / NEPRA / inspector |
| Tariff/margin violation | NEPRA |${DISCLAIMER}`;
  }

  if (
    matchesAny(['what is evse', 'what is pevcs', 'what is margin', 'definition', 'definitions', 'what does evse mean'])
  ) {
    return `### Key Definitions (NEPRA Chapter 16)

| Term | Meaning |
|------|---------|
| **EV** | Electric vehicle with rechargeable battery |
| **EVSE** | Charger, connectors, protection, wiring and related system |
| **EV Services** | Charging services for EV users |
| **EV User** | Person who owns, charges or operates an EV |
| **PEVCS** | Public EV Charging Station for public users |
| **Margin** | NEPRA-allowed amount per unit/kWh charged to user |

PEVCS = **Commercial Consumer Category** under NEPRA Chapter 16.${DISCLAIMER}`;
  }

  if (matchesAny(['standard', 'standards', 'iec', 'ieee', 'nfpa', 'distribution code'])) {
    return `### Applicable Standards
- **NEPRA** — Regulatory compliance
- **NEECA** — Energy efficiency
- **PSQCA** — Pakistan standards
- **Distribution Code** — DISCO requirements
- **IEC / IEEE / NFPA / UL / ISO / ASTM / BS** — Equipment safety

Include manufacturer compliance documents and IP/IK certificates in submission.${DISCLAIMER}`;
  }

  if (matchesAny(['important point', 'approval', 'most important', 'priority', 'take seriously', 'key point'])) {
    return `### Top IESCO Approval Priorities

1. Load feasibility (transformer/feeder capacity)
2. Separate commercial connection and approved metering
3. Earthing and protection (RCCB/RCD/ELCB, overload, short-circuit)
4. Safe site layout (hazardous zones, vehicle impact)
5. NEPRA tariff/margin compliance
6. Complete documentation (SLD, load calc, site plan, datasheet, safety plan)${DISCLAIMER}`;
  }

  if (
    matchesAny([
      'chapter 16', 'nepra chapter', 'pevcs', 'iesco ev', 'iesco connection',
      'iesco approval', 'iesco requirement', 'evcs compliance',
      'ev charging station compliance', 'public electric vehicle charging',
      'nepra regulation', 'nepra requirement', 'nepra ev', 'disco connection',
      'commercial consumer category',
    ])
  ) {
    return `### Direct Answer
**NEPRA Chapter 16** regulates Public EV Charging Stations (PEVCS). IESCO connection = **Commercial Consumer** application plus Chapter 16 safety, metering, billing, and operational rules.

### Basic Regulatory Position
- **Category:** Commercial Consumer
- **Authorities:** NEPRA, DISCO/IESCO, NEECA, PSQCA
- **Billing:** Owner may design own invoice format
- **Tariff:** Must stay within NEPRA-approved maximum margin

### Required Documents (Summary)
**Legal:** CNIC/NTN, ownership/lease, authority letter, existing bill, NEECA docs
**Technical:** Load calc, SLD, layout, transformer/cable calc, earthing, protection, datasheet, IP/IK cert, fire plan
**Commercial:** Tariff acceptance, demand notice payment, billing display

### Important Note
EVConsults supports IESCO files, NEPRA compliance, and commissioning. [Contact us](/contact) for expert review.${DISCLAIMER}`;
  }

  return null;
}

export function isEVCSComplianceQuestion(normalized) {
  if (!normalized) return false;
  const terms = [
    'chapter 16', 'nepra', 'iesco', 'pevcs', 'evcs', 'evse', 'disco',
    'earthing', 'grounding', 'metering', 'noc', 'sld', 'single line',
    'transformer', 'feeder', 'ocpp', 'neeca', 'psqca', 'margin',
    'commercial consumer', 'rccb', 'rcd', 'elcb', 'ip rating', 'ik10',
    'load calculation', 'fire safety plan', 'petrol pump',
  ];
  return terms.some((t) => normalized.includes(t));
}
