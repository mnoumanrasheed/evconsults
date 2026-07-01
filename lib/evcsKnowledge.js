/**
 * NEPRA Chapter 16: Public Electric Vehicle Charging Stations
 * Practical Compliance Guide for IESCO EV Station Connection
 * 
 * This file is the primary knowledge base injected into the chatbot's LLM context.
 * It must contain the FULL document so the AI can answer any question from any section.
 */

export function getEVCSKnowledge() {
    return `
NEPRA Chapter 16: Public Electric Vehicle Charging Stations
Practical Compliance Guide for IESCO EV Station Connection

══════════════════════════════════════════════════════════════
1. BASIC REGULATORY POSITION
══════════════════════════════════════════════════════════════

| Item               | Requirement                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| Category            | Public EV Charging Station falls under Commercial Consumer Category         |
| Applicable Authority| NEPRA, DISCO/IESCO, NEECA, PSQCA and other relevant standards bodies       |
| Applicable Chapter  | Chapter 16: Public Electric Vehicle Charging Stations                      |
| Main Purpose        | To regulate installation, safety, metering, billing, operation and maintenance of EV charging stations |
| Billing Freedom     | EV station owner may design its own bill/invoice format for EV users       |
| Tariff Control      | Charging rate must remain within NEPRA-approved maximum margin/tariff limit |

══════════════════════════════════════════════════════════════
2. KEY DEFINITIONS
══════════════════════════════════════════════════════════════

| Term        | Simple Meaning                                                              |
|-------------|-----------------------------------------------------------------------------|
| EV          | Electric vehicle using electric motor and rechargeable battery              |
| EVSE        | Electric Vehicle Supply Equipment, i.e., charger, connectors, protection devices, wiring and related system |
| EV Services | Charging services provided to EV users                                     |
| EV User     | Person who owns, charges or operates an EV                                 |
| PEVCS       | Public Electric Vehicle Charging Station where public users can charge EVs |
| Margin      | Amount allowed by NEPRA per unit/kWh to be charged from EV user            |

══════════════════════════════════════════════════════════════
3. IESCO CONNECTION / LICENSING PERSPECTIVE
══════════════════════════════════════════════════════════════

Step 1: Submission of Application / NOC
For IESCO, the applicant should prepare and submit the application for EVCS connection/NOC along with:

| Required Document / Information                        | Purpose                                      |
|--------------------------------------------------------|----------------------------------------------|
| CNIC / NTN / company documents                        | Applicant identification                     |
| Ownership / lease document of site                     | Proof of site control                        |
| Site address and location plan                         | For technical survey                         |
| Existing electricity bill, if connection already exists| To verify existing load and consumer record  |
| Proposed charger capacity                              | To assess load requirement                   |
| Single Line Diagram                                    | Electrical design review                     |
| Load calculation                                       | Transformer / feeder capacity check          |
| Layout plan                                            | Parking, charger, cable route and safety clearance |
| NEECA / PSQCA / manufacturer compliance documents      | Equipment standard verification              |

Opinion: For IESCO approval, the strongest file is one that clearly shows load demand, site layout, safety protections, earthing design and transformer/feeder feasibility. Weak drawings usually delay approval.

══════════════════════════════════════════════════════════════
4. SITE SURVEY AND FEASIBILITY
══════════════════════════════════════════════════════════════

IESCO/DISCO will normally check:

| Checkpoint                   | What IESCO Will Verify                                           |
|------------------------------|------------------------------------------------------------------|
| Feeder capacity              | Whether the nearby feeder can support additional EV load         |
| Transformer capacity         | Whether existing transformer is sufficient                       |
| New transformer requirement  | If load is high, dedicated transformer may be required           |
| Service line route           | Safe and practical route for cable                               |
| Metering arrangement         | Separate approved meter for EV station                           |
| Safety clearance             | Distance from hazardous area, public access and obstacles        |
| Earthing system              | Proper grounding resistance and continuity                       |

══════════════════════════════════════════════════════════════
5. COMMERCIAL TARIFF AND BILLING
══════════════════════════════════════════════════════════════

| Requirement            | Explanation                                                          |
|------------------------|----------------------------------------------------------------------|
| Commercial category    | PEVCS will be billed under commercial consumer category              |
| Maximum margin         | EV station cannot charge customers above NEPRA-approved margin       |
| Display of rates       | Charging rate/margin must be clearly displayed at the site and online if applicable |
| Billing transparency   | EV user should know kWh consumed, rate charged and total amount      |
| Overcharging risk      | If overcharging is found, DISCO may report it to NEPRA and penalties may apply |
| Billing format         | Owner may design own bill/invoice format for EV users                |

══════════════════════════════════════════════════════════════
6. METERING REQUIREMENTS
══════════════════════════════════════════════════════════════

| Requirement          | Practical Meaning                                                   |
|----------------------|---------------------------------------------------------------------|
| Separate connection  | Each PEVCS should have separate DISCO-approved connection           |
| Approved meter       | Meter must be approved by DISCO/IESCO                              |
| Accurate kWh recording | Meter must properly record energy supplied to EV charging station |
| Inspection rights    | IESCO/DISCO may inspect the meter anytime                          |
| Tampering control    | Any defect, interference or wrong billing must be corrected        |
| Record retention     | Inspection, testing and maintenance records should be preserved for 3 years |

══════════════════════════════════════════════════════════════
7. TECHNICAL AND SAFETY STANDARDS
══════════════════════════════════════════════════════════════

EVSE and PEVCS must comply with relevant standards, including:

| Standard Body / Code | Relevance                                          |
|-----------------------|----------------------------------------------------|
| NEPRA                 | Regulatory compliance                              |
| NEECA                 | Energy efficiency and conservation                 |
| PSQCA                 | Pakistan standards                                 |
| Distribution Code     | DISCO technical requirements                       |
| IEC                   | International EV charging and electrical safety standards |
| IEEE                  | Electrical engineering standards                   |
| NFPA                  | Fire safety standards                              |
| UL / ISO / ASTM / BS | Equipment quality and safety standards             |

══════════════════════════════════════════════════════════════
8. INSTALLATION REQUIREMENTS
══════════════════════════════════════════════════════════════

| Requirement             | Practical Compliance                                                |
|-------------------------|---------------------------------------------------------------------|
| Proper location         | Charger should not obstruct public/private footpaths               |
| Socket height           | Socket outlet should be at least 800 mm above finished ground level|
| Cable distance          | EV inlet and charger should be close enough; cord should be of suitable length |
| No extension cord       | Extension lead or second supply lead should not be used            |
| Protection from impact  | Charger should be protected from vehicle impact                    |
| Outdoor protection      | Outdoor EVSE should have proper weather protection                 |
| Minimum IP rating       | Outdoor/damp location should have at least IPX4; in some cases IP44/IP55 may apply |
| Mechanical protection   | Outdoor EVSE should have suitable impact protection, generally IK10 where required |
| Parking layout          | EV should be parked so charging point remains safely accessible    |

══════════════════════════════════════════════════════════════
9. ELECTRICAL PROTECTION REQUIREMENTS
══════════════════════════════════════════════════════════════

| Protection                        | Purpose                                                    |
|-----------------------------------|------------------------------------------------------------|
| Short-circuit protection          | Prevents damage during faults                              |
| Overcurrent protection            | Protects cable and equipment from excessive current        |
| Overload protection               | Prevents overheating                                       |
| Earth leakage protection          | Protects users from electric shock                         |
| RCD / RCCB / ELCB                 | Mandatory protective devices for leakage/fault current     |
| Overvoltage protection            | Protects charger and vehicle battery                       |
| Reverse power flow protection     | Prevents uncontrolled reverse flow from vehicle to grid    |
| Battery overcharging protection   | Prevents overvoltage/overloading of EV battery             |
| Lightning protection              | Required for charging station safety                       |
| Interlocks                        | Charging point should not energize until connected to vehicle |

══════════════════════════════════════════════════════════════
10. EARTHING / GROUNDING REQUIREMENTS
══════════════════════════════════════════════════════════════

| Requirement                   | Compliance Point                                             |
|-------------------------------|--------------------------------------------------------------|
| Proper earthing               | Charging station must have dedicated earthing/grounding system|
| Bonding                       | Vehicle and equipment bonding system must be maintained       |
| Resistance limit              | As per design, manufacturer instructions or Distribution Code|
| General limit                 | Earthing resistance should not exceed 5 ohms                 |
| Transformer grounding path    | Should not exceed 2.5 ohms where applicable                  |
| Testing frequency             | Earthing continuity and resistance should be checked periodically |
| Critical care                 | Critical systems should be checked every 6 months            |
| Record keeping                | Testing records should be retained for 3 years               |
| Tagging                       | Equipment should have nameplate/tag numbers for tracking      |

══════════════════════════════════════════════════════════════
11. OPERATIONS REQUIREMENTS
══════════════════════════════════════════════════════════════

| Requirement              | Practical Meaning                                              |
|--------------------------|----------------------------------------------------------------|
| Smart capability         | EVSE should support smart charging where applicable            |
| OCPP support             | Open Charge Point Protocol is required/preferred for communication |
| EMS integration          | Charger should communicate with Energy Management System       |
| Metering accuracy        | Billing should be based on accurate metering                   |
| Network connectivity     | System should support technical billing and monitoring         |
| Fault detection          | Charger should detect and report faults                        |
| User safety              | Clear instructions should be displayed                         |
| Bi-directional communication | EVSE should communicate with vehicle and monitoring system |

══════════════════════════════════════════════════════════════
12. SAFETY SIGNAGE AND USER INSTRUCTIONS
══════════════════════════════════════════════════════════════

The site should display:

| Sign / Instruction            | Requirement                                      |
|-------------------------------|--------------------------------------------------|
| Danger sign                   | Near panel, transformer and hazardous areas      |
| Caution sign                  | Where users may face safety risk                 |
| Safe charging instructions    | For EV users and operator                        |
| Fire safety instructions      | Near fire extinguisher/fire system                |
| Emergency contact             | Operator / site manager contact                  |
| Language                      | Urdu, English and/or local language              |
| Visibility                    | Clear, readable and fixed at prominent locations |

══════════════════════════════════════════════════════════════
13. PETROL PUMP / GAS STATION INSTALLATION
══════════════════════════════════════════════════════════════

If EV station is installed at a petrol pump or gas station:

| Requirement              | Explanation                                                     |
|--------------------------|-----------------------------------------------------------------|
| Outside hazardous zone   | Charger must not be installed in hazardous fuel area            |
| Safety clearance         | Must maintain distance from fuel dispensing zone                |
| Fire protection          | Fire safety system must be available                            |
| No unauthorized access   | Stray animals and unauthorized persons should be controlled     |
| Vehicle movement safety  | Charger should not obstruct traffic movement                    |
| Mechanical barriers      | Bollards/barriers should protect charger from vehicle impact    |

══════════════════════════════════════════════════════════════
14. MAINTENANCE AND INSPECTION
══════════════════════════════════════════════════════════════

| Requirement              | Frequency / Action                                              |
|--------------------------|-----------------------------------------------------------------|
| Preventive maintenance   | As per manufacturer manual                                      |
| Inspection and testing   | At specified intervals                                          |
| Annual inspection        | At least yearly or during major breakdown                       |
| Third-party inspection   | May be arranged by Electrical Inspector or approved inspector   |
| Fault recording          | Faults should be recorded and resolved                          |
| Maintenance record       | Must be preserved for 3 years                                   |
| Testing record           | Must be preserved for 3 years                                   |
| Calibration              | Metering and protection devices should be verified              |

══════════════════════════════════════════════════════════════
15. FIRE AND EMERGENCY SAFETY
══════════════════════════════════════════════════════════════

| Item                    | Requirement                                                    |
|-------------------------|----------------------------------------------------------------|
| Fire detection          | Required as per applicable code                                |
| Fire alarm              | Required where applicable                                      |
| Fire extinguisher       | Suitable extinguisher should be available                       |
| Emergency shutdown      | System should allow safe disconnection                         |
| Live part protection    | Live parts should not be accessible                            |
| Enclosure safety        | Charger enclosure should be secure and protected               |
| Lightning protection    | Required for charging station                                  |

══════════════════════════════════════════════════════════════
16. COMPLAINTS AND DISPUTE RESOLUTION
══════════════════════════════════════════════════════════════

| Complaint Type                | Responsible Entity                      |
|-------------------------------|-----------------------------------------|
| Overbilling by EV station     | PEVCS owner / NEPRA                     |
| Wrong DISCO bill              | IESCO/DISCO                             |
| Meter defect                  | IESCO/DISCO                             |
| Charging service complaint    | PEVCS owner                             |
| Safety complaint              | DISCO / NEPRA / relevant inspector      |
| Tariff/margin violation       | NEPRA                                   |

══════════════════════════════════════════════════════════════
17. PRACTICAL FILE CHECKLIST FOR IESCO SUBMISSION
══════════════════════════════════════════════════════════════

A. Legal Documents:
| Document                                        | Status                              |
|-------------------------------------------------|-------------------------------------|
| CNIC / NTN / SECP documents                    | Required                            |
| Site ownership / lease agreement                | Required                            |
| Authority letter, if company representative     | Required                            |
| Existing electricity bill, if any               | Required                            |
| NEECA / registration certificate, if applicable | Recommended / required as per process|

B. Technical Documents:
| Document                          | Status       |
|-----------------------------------|--------------|
| Load demand calculation           | Required     |
| Single Line Diagram              | Required     |
| Site layout plan                  | Required     |
| Transformer requirement calculation | Required   |
| Cable sizing calculation          | Required     |
| Earthing design                   | Required     |
| Protection scheme                 | Required     |
| Charger technical datasheet       | Required     |
| IP / IK rating certificate        | Required     |
| OCPP / smart charging details     | Recommended  |
| Fire safety plan                  | Required     |

C. Commercial Documents:
| Document                              | Status                       |
|---------------------------------------|------------------------------|
| Tariff/category acceptance            | Required                     |
| Estimated connection cost/demand notice | To be issued by IESCO      |
| Security deposit/payment proof        | Required after demand notice |
| Billing display mechanism             | Recommended                  |
| EV user invoice format                | Recommended                  |

══════════════════════════════════════════════════════════════
18. RECOMMENDED SEQUENCE FOR GETTING IESCO EV STATION CONNECTION
══════════════════════════════════════════════════════════════

| Step | Action                                                            |
|------|-------------------------------------------------------------------|
| 1    | Finalize site and charger capacity                                |
| 2    | Prepare load calculation and layout                               |
| 3    | Prepare single line diagram and earthing/protection design        |
| 4    | Submit application to IESCO/MIRAD or relevant office              |
| 5    | IESCO conducts site survey and feasibility                        |
| 6    | IESCO verifies feeder/transformer capacity                       |
| 7    | NOC / technical approval is issued                                |
| 8    | Demand notice is issued                                           |
| 9    | Applicant deposits required amount                                |
| 10   | Connection, transformer, meter and service line are installed     |
| 11   | Charger installation is inspected                                 |
| 12   | Station is energized                                              |
| 13   | Operator displays tariff/margin and safety instructions           |
| 14   | Maintain records, testing and complaint handling system            |

══════════════════════════════════════════════════════════════
19. MOST IMPORTANT POINTS FOR APPROVAL
══════════════════════════════════════════════════════════════

These are the points IESCO will take most seriously:
1. Load feasibility — whether the local transformer/feeder can support the EV charger load.
2. Separate commercial connection and approved metering.
3. Earthing and protection system, especially RCCB/RCD/ELCB, overload, short-circuit and overvoltage protection.
4. Safe site layout, especially distance from public movement, petrol/gas hazardous zones and vehicle impact risk.
5. NEPRA tariff/margin compliance, meaning the operator cannot overcharge EV users.
6. Proper documentation, including SLD, load calculation, site plan, charger datasheet and safety plan.

══════════════════════════════════════════════════════════════
20. SHORT SUMMARY
══════════════════════════════════════════════════════════════

For an EV charging station connection from IESCO, the applicant should treat the case as a commercial electricity connection with additional NEPRA Chapter 16 safety, tariff, metering and operational requirements. The strongest application will include proper site ownership documents, technical drawings, load calculations, separate metering plan, earthing/protection design, certified EVSE equipment details, fire safety plan and tariff/margin display mechanism.

══════════════════════════════════════════════════════════════
TRANSFORMER SIZING GUIDANCE
══════════════════════════════════════════════════════════════

Formula: kVA = kW / Power Factor
Example: For a 120 kW charger at 0.9 PF:
  kVA = 120 / 0.9 = 133.33 kVA
  Practically, a 150 kVA transformer is safer than 100 kVA.
  Final approval depends on IESCO load study, feeder capacity, transformer loading and site survey.

══════════════════════════════════════════════════════════════
NEECA LICENSE SEQUENCING NOTE
══════════════════════════════════════════════════════════════

The file should include NEECA / PSQCA / manufacturer compliance documents where applicable. However, final sequencing (whether NEECA license is required before or after IESCO application) depends on the relevant authority's process. It is recommended to prepare all technical and compliance documents before submission to avoid delays.
`;
}
