/* ============================================================
   CompTIA Security+ SY0-701 study data
   Plain globals (no modules) so the app runs from file:// with
   no build step or server. Add your own items freely.
   ============================================================ */

/* ---------- Ports & protocols (the "what port is X" drill) ---------- */
const PORTS = [
  { port: "20/21", proto: "TCP", service: "FTP", note: "File Transfer Protocol — 20 data, 21 control. Cleartext." },
  { port: "22", proto: "TCP", service: "SSH / SCP / SFTP", note: "Secure shell; also tunnels SFTP and SCP. Encrypted." },
  { port: "23", proto: "TCP", service: "Telnet", note: "Remote shell, cleartext — insecure, replaced by SSH." },
  { port: "25", proto: "TCP", service: "SMTP", note: "Sending email between servers. Cleartext (587 for submission w/ TLS)." },
  { port: "49", proto: "TCP", service: "TACACS+", note: "Cisco AAA; encrypts the entire payload (vs RADIUS)." },
  { port: "53", proto: "TCP/UDP", service: "DNS", note: "Name resolution. UDP for queries, TCP for zone transfers." },
  { port: "67/68", proto: "UDP", service: "DHCP", note: "67 server, 68 client. Dynamic IP assignment." },
  { port: "69", proto: "UDP", service: "TFTP", note: "Trivial FTP — no auth, used for firmware/PXE boot." },
  { port: "80", proto: "TCP", service: "HTTP", note: "Web, cleartext." },
  { port: "88", proto: "TCP/UDP", service: "Kerberos", note: "Network authentication / ticket granting (Active Directory)." },
  { port: "110", proto: "TCP", service: "POP3", note: "Retrieve email, downloads & deletes. Cleartext." },
  { port: "123", proto: "UDP", service: "NTP", note: "Time sync — critical for Kerberos, logs, certificates." },
  { port: "137-139", proto: "TCP/UDP", service: "NetBIOS", note: "Legacy Windows name/session service." },
  { port: "143", proto: "TCP", service: "IMAP", note: "Retrieve email, keeps it on server. Cleartext." },
  { port: "161/162", proto: "UDP", service: "SNMP", note: "161 polling, 162 traps. Manage network devices (v3 = secure)." },
  { port: "389", proto: "TCP/UDP", service: "LDAP", note: "Directory queries (Active Directory). Cleartext." },
  { port: "443", proto: "TCP", service: "HTTPS", note: "HTTP over TLS. Encrypted web." },
  { port: "445", proto: "TCP", service: "SMB", note: "Windows file sharing. Targeted by EternalBlue/WannaCry." },
  { port: "465 / 587", proto: "TCP", service: "SMTPS / Submission", note: "Encrypted email submission (587 STARTTLS, 465 implicit TLS)." },
  { port: "514", proto: "UDP", service: "Syslog", note: "Sending log messages to a collector / SIEM." },
  { port: "636", proto: "TCP", service: "LDAPS", note: "LDAP over TLS/SSL. Encrypted directory." },
  { port: "860 / 3260", proto: "TCP", service: "iSCSI", note: "IP-based storage area network (SAN) traffic." },
  { port: "989/990", proto: "TCP", service: "FTPS", note: "FTP over TLS (explicit/implicit). Not the same as SFTP." },
  { port: "993", proto: "TCP", service: "IMAPS", note: "IMAP over TLS. Encrypted." },
  { port: "995", proto: "TCP", service: "POP3S", note: "POP3 over TLS. Encrypted." },
  { port: "1433", proto: "TCP", service: "Microsoft SQL Server", note: "MS SQL database traffic." },
  { port: "1645/1646 · 1812/1813", proto: "UDP", service: "RADIUS", note: "AAA; encrypts only the password. 1812 auth / 1813 accounting." },
  { port: "3306", proto: "TCP", service: "MySQL", note: "MySQL database traffic." },
  { port: "3389", proto: "TCP", service: "RDP", note: "Remote Desktop Protocol (Windows GUI remote access)." },
  { port: "5060/5061", proto: "TCP/UDP", service: "SIP", note: "VoIP session setup. 5061 is SIP over TLS." },
];

/* ---------- Multiple-choice questions ---------- */
/* answer = index (0-based) of the correct option */
const QUESTIONS = [
  // ----- Ports & Protocols -----
  { cat: "Ports & Protocols", q: "Which ports does FTP use by default?", o: ["20 and 21", "22 and 23", "80 and 443", "67 and 68"], a: 0, e: "FTP uses TCP 21 for control and TCP 20 for data. SFTP (over SSH) is 22; FTPS is 989/990." },
  { cat: "Ports & Protocols", q: "SSH, SFTP, and SCP all run over which port?", o: ["443", "22", "23", "21"], a: 1, e: "SSH (TCP 22) provides the encrypted channel that SFTP and SCP ride on. Telnet (23) is its insecure predecessor." },
  { cat: "Ports & Protocols", q: "A technician needs the secure equivalent of LDAP. Which port?", o: ["389", "636", "443", "161"], a: 1, e: "LDAPS (LDAP over TLS) uses TCP 636. Plain LDAP is 389." },
  { cat: "Ports & Protocols", q: "Which protocol/port pair is used to securely manage network devices?", o: ["SNMPv3 / UDP 161", "Telnet / TCP 23", "TFTP / UDP 69", "SMTP / TCP 25"], a: 0, e: "SNMP polls on UDP 161 (traps on 162). Only SNMPv3 adds authentication and encryption; v1/v2c are cleartext." },
  { cat: "Ports & Protocols", q: "RDP, used for remote Windows desktops, listens on which port?", o: ["3389", "5900", "1433", "3306"], a: 0, e: "RDP = TCP 3389. (VNC is 5900, MS SQL 1433, MySQL 3306.)" },
  { cat: "Ports & Protocols", q: "Kerberos authentication in Active Directory uses which port?", o: ["88", "389", "445", "53"], a: 0, e: "Kerberos uses 88 (TCP/UDP). Accurate time (NTP/123) is essential because tickets are time-sensitive." },
  { cat: "Ports & Protocols", q: "Which port should be open for a device to send logs to a SIEM collector?", o: ["UDP 514 (Syslog)", "TCP 25 (SMTP)", "UDP 53 (DNS)", "TCP 3389 (RDP)"], a: 0, e: "Syslog uses UDP 514 by default to forward log messages to a collector or SIEM." },
  { cat: "Ports & Protocols", q: "WannaCry/EternalBlue exploited a vulnerability in which service and port?", o: ["SMB / TCP 445", "RDP / TCP 3389", "HTTP / TCP 80", "DNS / UDP 53"], a: 0, e: "SMB (TCP 445) was the target. Blocking 445 at the perimeter is a common hardening step." },

  // ----- Cryptography -----
  { cat: "Cryptography", q: "Which goal does hashing primarily provide?", o: ["Confidentiality", "Integrity", "Availability", "Non-repudiation by itself"], a: 1, e: "Hashing verifies integrity — any change to the input changes the digest. It does not encrypt (no confidentiality) and is not reversible." },
  { cat: "Cryptography", q: "Alice encrypts a message so only Bob can read it. Which key does she use?", o: ["Bob's public key", "Bob's private key", "Alice's private key", "A shared symmetric key only Alice has"], a: 0, e: "Encrypt with the recipient's PUBLIC key; only Bob's matching private key can decrypt — providing confidentiality." },
  { cat: "Cryptography", q: "Alice wants to digitally sign a message. Which key does she use?", o: ["Her own private key", "Bob's public key", "Bob's private key", "A shared session key"], a: 0, e: "Sign with your PRIVATE key; anyone can verify with your public key — giving integrity, authentication, and non-repudiation." },
  { cat: "Cryptography", q: "Which is a symmetric encryption algorithm?", o: ["AES", "RSA", "ECC", "Diffie-Hellman"], a: 0, e: "AES is symmetric (one shared key, fast, bulk data). RSA/ECC are asymmetric; Diffie-Hellman is key exchange." },
  { cat: "Cryptography", q: "What is the main purpose of a salt when storing passwords?", o: ["Speed up hashing", "Defeat precomputed rainbow-table attacks", "Encrypt the password reversibly", "Compress the hash"], a: 1, e: "A unique random salt per password means identical passwords hash differently, defeating rainbow tables and making mass cracking harder." },
  { cat: "Cryptography", q: "Which provides perfect forward secrecy?", o: ["Reusing the same RSA key for every session", "Ephemeral key exchange", "ECB mode", "Storing keys in plaintext"], a: 1, e: "Ephemeral Diffie-Hellman (DHE/ECDHE) generates a fresh key per session, so compromise of a long-term key doesn't expose past traffic." },
  { cat: "Cryptography", q: "A company must encrypt a laptop's entire disk so data is safe if stolen. Best choice?", o: ["TLS", "Full-disk encryption", "Hashing the files", "Steganography"], a: 1, e: "FDE protects data at rest. A TPM stores the key in hardware and ties it to the platform, preventing the disk being read in another machine." },
  { cat: "Cryptography", q: "What does a TPM provide?", o: ["A network firewall", "A hardware root of trust for storing keys", "An antivirus engine", "A password manager in the cloud"], a: 1, e: "A Trusted Platform Module is a chip on the motherboard that securely stores keys and supports secure boot / measured boot. An HSM is the removable/enterprise equivalent." },
  { cat: "Cryptography", q: "Which best describes the difference between encoding and encryption?", o: ["Encoding requires a key; encryption does not", "Encoding is for usability/format and is reversible without a key; encryption protects confidentiality and needs a key", "They are identical", "Encoding is always stronger"], a: 1, e: "Base64 is encoding — no secret, anyone can decode. Encryption requires a key to reverse and provides confidentiality." },

  // ----- Threats & Attacks -----
  { cat: "Threats & Attacks", q: "An attacker sends an urgent email impersonating the CEO to trick finance into wiring money. This is:", o: ["Whaling / BEC", "Smishing", "Vishing", "Tailgating"], a: 0, e: "Targeting a high-value individual (or impersonating one) is whaling; the wire-fraud variant is Business Email Compromise (BEC). Smishing=SMS, vishing=voice." },
  { cat: "Threats & Attacks", q: "A user receives a text message with a malicious link. This social-engineering type is:", o: ["Smishing", "Vishing", "Phishing", "Pharming"], a: 0, e: "SMS phishing = smishing. Voice = vishing. Pharming redirects via poisoned DNS/hosts file." },
  { cat: "Threats & Attacks", q: "An attacker inserts ' OR '1'='1 into a login form. This is:", o: ["Cross-site scripting", "SQL injection", "CSRF", "Buffer overflow"], a: 1, e: "Injecting SQL through input is SQL injection. Best defense: parameterized queries / prepared statements and input validation." },
  { cat: "Threats & Attacks", q: "A script stored on a forum runs in other users' browsers when they view a post. This is:", o: ["Stored XSS", "Reflected XSS", "SQL injection", "Directory traversal"], a: 0, e: "Malicious script saved on the server and served to victims = stored/persistent XSS. Reflected XSS bounces off a crafted link." },
  { cat: "Threats & Attacks", q: "An attacker intercepts and possibly alters traffic between two parties. This is a(n):", o: ["On-path / MITM attack", "Replay attack", "Privilege escalation", "Watering hole"], a: 0, e: "Sitting between endpoints is an on-path / MITM attack. Mitigate with mutual TLS, certificate validation, and HSTS." },
  { cat: "Threats & Attacks", q: "Captured authentication data is resent later to gain access. This is a:", o: ["Replay attack", "Brute force", "Pass-the-hash only", "Phishing"], a: 0, e: "Reusing captured valid data is a replay attack. Nonces, timestamps, and session tokens defend against it." },
  { cat: "Threats & Attacks", q: "An attacker compromises a website frequently visited by employees of a target org. This is:", o: ["Watering hole attack", "Whaling", "Typosquatting", "Pretexting"], a: 0, e: "Poisoning a site the target group trusts/visits is a watering hole attack." },
  { cat: "Threats & Attacks", q: "Registering 'gooogle.com' to catch mistyped traffic is:", o: ["Typosquatting", "Pharming", "Pretexting", "Shoulder surfing"], a: 0, e: "Exploiting typos in domain names is typosquatting/URL hijacking." },
  { cat: "Threats & Attacks", q: "Which attack overwrites adjacent memory to execute arbitrary code?", o: ["Buffer overflow", "Cross-site scripting", "Phishing", "Rainbow table"], a: 0, e: "Writing past a buffer's bounds can overwrite the return address and execute code. Mitigations: ASLR, DEP/NX, bounds checking." },
  { cat: "Threats & Attacks", q: "A vulnerability that is unknown to the vendor and has no patch is called:", o: ["Zero-day", "Legacy bug", "Misconfiguration", "End-of-life flaw"], a: 0, e: "A zero-day is unknown/unpatched, so signature defenses often miss it; behavior-based detection helps." },
  { cat: "Threats & Attacks", q: "An attacker uses one set of stolen username/password pairs against many sites. This is:", o: ["Credential stuffing", "Password spraying", "Dictionary attack", "Rainbow table"], a: 0, e: "Credential stuffing reuses breached credentials across services (relies on password reuse). Password spraying tries a few common passwords across many accounts." },
  { cat: "Threats & Attacks", q: "Trying 'Summer2025!' against thousands of accounts to avoid lockout is:", o: ["Password spraying", "Credential stuffing", "Brute force on one account", "Pass-the-hash"], a: 0, e: "Password spraying uses one/few passwords across many accounts to stay under lockout thresholds." },

  // ----- Malware -----
  { cat: "Malware", q: "Malware that encrypts files and demands payment is:", o: ["Ransomware", "Rootkit", "Keylogger", "Logic bomb"], a: 0, e: "Ransomware extorts via encryption (often with data-exfiltration 'double extortion'). Offline, tested backups are the key control." },
  { cat: "Malware", q: "Malware that hides at a low level (often kernel) to evade detection and maintain access is a:", o: ["Rootkit", "Worm", "Adware", "PUP"], a: 0, e: "Rootkits operate at OS/kernel/firmware level to hide. Secure/measured boot and integrity checks help detect them." },
  { cat: "Malware", q: "Self-replicating malware that spreads across a network without user action is a:", o: ["Worm", "Virus", "Trojan", "Spyware"], a: 0, e: "A worm self-propagates over the network (e.g., via SMB). A virus needs a host file/user action; a Trojan masquerades as legit software." },
  { cat: "Malware", q: "Malicious code that triggers when a specific condition is met (e.g., a date or a fired employee's account being disabled) is a:", o: ["Logic bomb", "Trojan", "Worm", "Backdoor"], a: 0, e: "A logic bomb lies dormant until its trigger condition. Often planted by insiders." },
  { cat: "Malware", q: "Software disguised as legitimate that opens hidden access is a:", o: ["Trojan", "Worm", "Rootkit", "RAT only"], a: 0, e: "A Trojan looks legitimate but carries a payload (often a backdoor/RAT)." },
  { cat: "Malware", q: "Which control most directly limits damage if ransomware encrypts a server?", o: ["Offline, tested backups", "A stronger password policy", "Disabling USB ports", "More CPU cores"], a: 0, e: "Recoverable, isolated backups let you restore without paying. 3-2-1: 3 copies, 2 media, 1 offsite/offline." },

  // ----- IAM -----
  { cat: "IAM", q: "Which is an example of multifactor authentication?", o: ["Password + PIN", "Password + fingerprint", "Two different passwords", "Username + password"], a: 1, e: "MFA requires factors of different types: something you know (password), have (token), are (biometric). Password+fingerprint = know + are. Password+PIN are both 'know'." },
  { cat: "IAM", q: "A smart card is which authentication factor?", o: ["Something you know", "Something you have", "Something you are", "Somewhere you are"], a: 1, e: "A smart card/token is 'something you have'. Biometrics = are; password = know; geolocation = somewhere you are." },
  { cat: "IAM", q: "Which access control model assigns permissions based on a user's job function?", o: ["RBAC (role-based)", "DAC (discretionary)", "MAC (mandatory)", "ABAC (attribute-based)"], a: 0, e: "Role-Based Access Control grants rights by role/job. MAC uses labels/clearances; DAC lets owners set permissions; ABAC uses attributes/policies." },
  { cat: "IAM", q: "In which model does a central authority enforce access using security labels and clearances?", o: ["Mandatory Access Control (MAC)", "Discretionary Access Control (DAC)", "Role-Based Access Control", "Rule-based"], a: 0, e: "MAC is label-based (e.g., Secret/Top Secret) and enforced by the system, common in military/government. Users can't change labels." },
  { cat: "IAM", q: "A user logs in once and accesses multiple apps without re-authenticating. This is:", o: ["Single sign-on", "Federation only", "MFA", "Just-in-time access"], a: 0, e: "SSO gives one authentication for many services. Federation extends trust across organizations (e.g., SAML/OIDC)." },
  { cat: "IAM", q: "Which protocol is commonly used for web SSO / identity federation with XML assertions?", o: ["SAML", "RADIUS", "Kerberos", "TACACS+"], a: 0, e: "SAML exchanges XML assertions between IdP and SP for web SSO. OAuth 2.0/OIDC are token/JSON-based alternatives." },
  { cat: "IAM", q: "The principle of granting users only the access they need is:", o: ["Least privilege", "Separation of duties", "Implicit deny", "Defense in depth"], a: 0, e: "Least privilege minimizes rights to what the job requires, limiting blast radius. Separation of duties splits a sensitive task across people." },
  { cat: "IAM", q: "Requiring two different people to complete a sensitive transaction is:", o: ["Separation of duties", "Least privilege", "Job rotation", "Mandatory vacation"], a: 0, e: "Separation of duties prevents fraud/error by splitting a task so no single person controls it end to end." },
  { cat: "IAM", q: "Which AAA protocol encrypts the entire packet and is often used for device administration?", o: ["TACACS+", "RADIUS", "LDAP", "SAML"], a: 0, e: "TACACS+ (TCP 49) encrypts the full payload and separates AAA. RADIUS encrypts only the password and is common for network access (802.1X)." },

  // ----- Network Security -----
  { cat: "Network Security", q: "Which device inspects traffic and can actively block malicious packets inline?", o: ["IPS", "IDS", "A hub", "A patch panel"], a: 0, e: "An IPS sits inline and can drop/block. An IDS only detects and alerts (out of band)." },
  { cat: "Network Security", q: "A segment that hosts public-facing servers, isolated from the internal LAN, is a:", o: ["Screened subnet", "VLAN 1", "Honeynet", "VPN concentrator"], a: 0, e: "A screened subnet (formerly DMZ) exposes services like web/mail while shielding the internal network." },
  { cat: "Network Security", q: "Which technology logically separates networks on the same physical switch?", o: ["VLAN", "VPN", "NAT", "DNS"], a: 0, e: "VLANs segment broadcast domains logically. They limit lateral movement and contain broadcast traffic." },
  { cat: "Network Security", q: "A decoy system designed to attract and study attackers is a:", o: ["Honeypot", "Bastion host", "Jump server", "Proxy"], a: 0, e: "A honeypot lures attackers to observe TTPs; a honeynet is a network of them. A honeytoken is fake data used to detect access." },
  { cat: "Network Security", q: "Port-based network access control that authenticates devices before granting LAN access uses:", o: ["802.1X", "802.11ac", "STP", "NAT"], a: 0, e: "IEEE 802.1X provides port-based NAC, typically with a RADIUS server and EAP." },
  { cat: "Network Security", q: "Which best protects data in transit for a remote worker connecting to the corporate network?", o: ["A VPN", "WEP", "FTP", "Telnet"], a: 0, e: "A VPN encrypts the tunnel (IPsec or TLS). WEP is broken; FTP/Telnet are cleartext." },
  { cat: "Network Security", q: "Which is the most secure wireless security standard listed?", o: ["WPA3", "WPA2", "WPA", "WEP"], a: 0, e: "WPA3 (SAE, forward secrecy) is strongest. WEP and WPA are deprecated/broken; WPA2 is okay but weaker than WPA3." },
  { cat: "Network Security", q: "Translating many private IPs to one public IP is:", o: ["NAT/PAT", "VLAN tagging", "Subnetting", "DNS resolution"], a: 0, e: "NAT (PAT specifically) maps internal addresses to a public IP, conserving addresses and hiding internal hosts." },

  // ----- Risk & Governance -----
  { cat: "Risk & Governance", q: "ALE is calculated as:", o: ["SLE × ARO", "AV × EF", "ARO ÷ SLE", "SLE − ARO"], a: 0, e: "Annual Loss Expectancy = Single Loss Expectancy × Annual Rate of Occurrence. SLE = Asset Value × Exposure Factor." },
  { cat: "Risk & Governance", q: "Buying cyber-insurance is which risk response?", o: ["Transfer", "Accept", "Avoid", "Mitigate"], a: 0, e: "Insurance transfers financial risk to a third party. Avoid=stop the activity; mitigate=reduce; accept=do nothing." },
  { cat: "Risk & Governance", q: "Maximum tolerable data loss, measured in time, is the:", o: ["RPO", "RTO", "MTTR", "MTBF"], a: 0, e: "Recovery Point Objective = how much data (in time) you can lose. RTO = how fast you must restore service." },
  { cat: "Risk & Governance", q: "The target time to restore a service after an outage is the:", o: ["RTO", "RPO", "MTBF", "SLE"], a: 0, e: "Recovery Time Objective is the acceptable downtime/restoration target." },
  { cat: "Risk & Governance", q: "Which agreement defines uptime/performance commitments between a provider and customer?", o: ["SLA", "MOU", "NDA", "BPA"], a: 0, e: "Service Level Agreement defines measurable service commitments. MOU=intent, NDA=confidentiality, BPA=business partner terms." },
  { cat: "Risk & Governance", q: "Data classified so only authorized personnel may view it, e.g., trade secrets, is best labeled:", o: ["Confidential/Proprietary", "Public", "Unclassified", "Open data"], a: 0, e: "Sensitive business data is Confidential/Proprietary. Classification drives handling, encryption, and access rules." },
  { cat: "Risk & Governance", q: "Who is ultimately accountable for a data set's protection and classification?", o: ["Data owner", "Data custodian", "Data processor", "End user"], a: 0, e: "The data owner (a senior/business role) is accountable; the custodian implements controls; the processor handles data on behalf of the controller." },
  { cat: "Risk & Governance", q: "Which regulation governs protection of EU residents' personal data?", o: ["GDPR", "HIPAA", "PCI DSS", "SOX"], a: 0, e: "GDPR covers EU personal data/privacy. HIPAA=US health, PCI DSS=card data, SOX=financial reporting." },

  // ----- Security Operations -----
  { cat: "Security Operations", q: "Which tool aggregates and correlates logs from many sources for real-time analysis?", o: ["SIEM", "DLP", "WAF", "CASB"], a: 0, e: "A SIEM centralizes, correlates, and alerts on log/event data. SOAR adds automated response playbooks." },
  { cat: "Security Operations", q: "A system that prevents sensitive data (e.g., SSNs) from leaving the organization is:", o: ["DLP", "IDS", "VPN", "TPM"], a: 0, e: "Data Loss Prevention inspects data in use/motion/rest and blocks unauthorized exfiltration." },
  { cat: "Security Operations", q: "Put the incident response phases in order:", o: ["Preparation → Identification → Containment → Eradication → Recovery → Lessons learned", "Identification → Preparation → Recovery → Containment", "Containment → Recovery → Preparation → Identification", "Eradication → Identification → Preparation → Recovery"], a: 0, e: "NIST-style IR order: Preparation, Identification (Detection), Containment, Eradication, Recovery, Lessons Learned." },
  { cat: "Security Operations", q: "When collecting evidence, the documentation proving who handled it and when is the:", o: ["Chain of custody", "Legal hold", "Order of volatility", "Service ticket"], a: 0, e: "Chain of custody preserves evidence integrity/admissibility by tracking handling. Order of volatility tells you what to collect first (RAM before disk)." },
  { cat: "Security Operations", q: "Per the order of volatility, which should be collected FIRST during forensics?", o: ["CPU registers/cache and RAM", "Data on backup tapes", "Files on the hard disk", "Printed documents"], a: 0, e: "Collect most volatile first: registers/cache, then RAM, then disk, then backups/archives." },
  { cat: "Security Operations", q: "A scan that reports a vulnerability that does not actually exist is a:", o: ["False positive", "False negative", "True positive", "Zero-day"], a: 0, e: "False positive = flagged but not real. False negative (more dangerous) = a real issue that was missed." },
  { cat: "Security Operations", q: "Which assessment actively exploits weaknesses to demonstrate impact?", o: ["Penetration test", "Vulnerability scan", "Compliance audit", "Risk register review"], a: 0, e: "A pen test exploits to prove impact; a vuln scan only identifies/ranks potential issues (usually non-intrusive)." },
  { cat: "Security Operations", q: "Which framework maps adversary tactics and techniques to help detection/response?", o: ["MITRE ATT&CK", "OWASP Top 10", "PCI DSS", "COBIT"], a: 0, e: "MITRE ATT&CK catalogs real-world tactics/techniques. The Cyber Kill Chain models attack stages; OWASP focuses on web app risks." },

  // ----- Architecture & Cloud -----
  { cat: "Architecture & Cloud", q: "In the cloud shared responsibility model under IaaS, the customer is responsible for:", o: ["The OS, apps, and data", "The physical datacenter", "The hypervisor", "The building's power"], a: 0, e: "Under IaaS the provider secures the physical/hypervisor layer; the customer secures the guest OS, apps, configs, and data. More moves to the provider as you go IaaS→PaaS→SaaS." },
  { cat: "Architecture & Cloud", q: "A security model that trusts no one by default and verifies every request is:", o: ["Zero Trust", "Perimeter (castle-and-moat)", "Open trust", "Implicit allow"], a: 0, e: "Zero Trust assumes breach and continuously verifies identity, device, and context — 'never trust, always verify'." },
  { cat: "Architecture & Cloud", q: "Which protects a web application from SQL injection and XSS at the HTTP layer?", o: ["WAF", "NGFW only", "Antivirus", "TPM"], a: 0, e: "A Web Application Firewall inspects HTTP(S) and filters app-layer attacks like SQLi/XSS." },
  { cat: "Architecture & Cloud", q: "A cloud security broker that enforces policy between users and cloud services is a:", o: ["CASB", "WAF", "IDS", "VPN concentrator"], a: 0, e: "A Cloud Access Security Broker sits between users and cloud apps to enforce visibility, DLP, and access policies." },
  { cat: "Architecture & Cloud", q: "Which design principle uses multiple overlapping layers of controls?", o: ["Defense in depth", "Single point of control", "Security through obscurity", "Implicit trust"], a: 0, e: "Defense in depth layers controls so failure of one doesn't compromise the whole system." },
  { cat: "Architecture & Cloud", q: "Immutable infrastructure and treating servers as disposable best supports which idea?", o: ["Replace rather than patch in place", "Manual configuration drift", "Long-lived snowflake servers", "Shared admin passwords"], a: 0, e: "Immutable infra redeploys clean images instead of patching live hosts, reducing drift and persistence of compromise." },

  // ----- Security Controls (Domain 1) -----
  { cat: "Security Controls", q: "A written security policy is an example of which control category?", o: ["Managerial", "Technical", "Physical", "Operational"], a: 0, e: "Policies, risk assessments, and procedures are managerial (administrative) controls. Technical=tech mechanisms, operational=people-run processes, physical=tangible." },
  { cat: "Security Controls", q: "A firewall and encryption are examples of which control category?", o: ["Technical", "Managerial", "Physical", "Directive"], a: 0, e: "Technical (logical) controls are implemented with technology — firewalls, encryption, IDS, authentication." },
  { cat: "Security Controls", q: "A 'Beware of Dog' or 'CCTV in use' sign is primarily which control function?", o: ["Deterrent", "Preventive", "Detective", "Corrective"], a: 0, e: "A deterrent discourages an attacker from acting. It doesn't physically stop them (preventive) or detect them (detective)." },
  { cat: "Security Controls", q: "Reviewing CCTV footage to identify an intruder after the fact uses which control function?", o: ["Detective", "Preventive", "Deterrent", "Compensating"], a: 0, e: "Detective controls identify/record incidents (CCTV recordings, IDS, log review). Preventive stops them first." },
  { cat: "Security Controls", q: "Restoring systems from backup after an incident is which control function?", o: ["Corrective", "Preventive", "Detective", "Directive"], a: 0, e: "Corrective controls remediate/restore after an event (backups, patching, quarantine)." },
  { cat: "Security Controls", q: "When the ideal control isn't feasible, an alternative that meets the requirement is a:", o: ["Compensating control", "Deterrent control", "Directive control", "Detective control"], a: 0, e: "A compensating control is a substitute that provides similar protection when the primary control can't be used." },
  { cat: "Security Controls", q: "An Acceptable Use Policy that instructs staff how to behave is which control function?", o: ["Directive", "Detective", "Corrective", "Compensating"], a: 0, e: "Directive controls guide/instruct behavior (policies, AUPs, standards, signage telling people what to do)." },
  { cat: "Security Controls", q: "A bollard (post blocking vehicles) is best classified as:", o: ["Physical / preventive", "Technical / detective", "Managerial / directive", "Operational / corrective"], a: 0, e: "A bollard is a physical control that prevents vehicle access — physical category, preventive function." },

  // ----- PKI & Certificates (Domain 1) -----
  { cat: "PKI & Certificates", q: "What does an organization send to a CA to request a certificate?", o: ["A certificate signing request", "A CRL", "Its private key", "An OCSP response"], a: 0, e: "A CSR contains the public key and identifying info. You never send your private key to the CA." },
  { cat: "PKI & Certificates", q: "Which provides real-time validation of a single certificate's revocation status?", o: ["OCSP", "CRL", "CSR", "CN"], a: 0, e: "OCSP queries the CA for the status of one cert in real time. A CRL is a (potentially large) downloaded list of all revoked certs." },
  { cat: "PKI & Certificates", q: "OCSP stapling improves performance by:", o: ["Having the web server present a timestamped, CA-signed OCSP response", "Disabling revocation checks", "Encrypting the CRL", "Pinning the certificate in the browser"], a: 0, e: "With stapling, the server attaches a recent CA-signed status during the TLS handshake, so the client needn't contact the CA itself." },
  { cat: "PKI & Certificates", q: "A certificate that secures example.com AND all of its subdomains is a:", o: ["Wildcard certificate", "SAN certificate", "Self-signed certificate", "Code-signing certificate"], a: 0, e: "A wildcard (*.example.com) covers all subdomains. A SAN certificate covers multiple specific names/domains you list." },
  { cat: "PKI & Certificates", q: "Which certificate secures several different domain names in one cert?", o: ["SAN certificate", "Wildcard certificate", "Root certificate", "OCSP certificate"], a: 0, e: "A Subject Alternative Name certificate lists multiple distinct names/domains (e.g., example.com, example.net, mail.example.org)." },
  { cat: "PKI & Certificates", q: "Why is a root CA often kept offline?", o: ["To protect the trust anchor; intermediate CAs issue day-to-day certs", "To save electricity", "Because it cannot issue certificates", "To speed up OCSP"], a: 0, e: "The root is the trust anchor — its compromise breaks the whole PKI. It stays offline and signs intermediate CAs that do routine issuing." },
  { cat: "PKI & Certificates", q: "Storing a copy of private keys with a trusted party so encrypted data can be recovered is:", o: ["Key escrow", "Key stretching", "Key pinning", "Certificate stapling"], a: 0, e: "Key escrow holds keys for recovery (e.g., if an employee leaves). It balances recoverability against added trust/risk." },
  { cat: "PKI & Certificates", q: "A browser warns a certificate is untrusted because the server issued it to itself. This is a:", o: ["Self-signed certificate", "Wildcard certificate", "Revoked certificate", "Pinned certificate"], a: 0, e: "Self-signed certs aren't issued by a trusted CA, so clients don't trust them by default. Fine for internal/testing, not public sites." },
  { cat: "PKI & Certificates", q: "Hard-coding which certificate/key an app should accept, to resist a fraudulent CA, is:", o: ["Certificate pinning", "Key escrow", "Stapling", "Cross-certification"], a: 0, e: "Pinning ties an app to a specific cert/public key so an attacker-issued (but technically valid) cert is rejected." },

  // ----- Threat Actors (Domain 2) -----
  { cat: "Threat Actors", q: "Which threat actor has the highest resources and stealth, often state-funded?", o: ["Advanced Persistent Threat", "Script kiddie", "Hacktivist", "Insider"], a: 0, e: "Nation-state/APT actors have the most resources and patience, aiming for long-term espionage with low detection." },
  { cat: "Threat Actors", q: "An attacker motivated by a political or social cause is a:", o: ["Hacktivist", "Organized crime group", "Script kiddie", "Competitor"], a: 0, e: "Hacktivists act for ideology/politics (defacements, leaks). Organized crime is financially motivated." },
  { cat: "Threat Actors", q: "An attacker using prebuilt tools without deep technical skill is a(n):", o: ["Unskilled attacker", "Nation-state", "APT", "Insider threat"], a: 0, e: "Unskilled attackers (formerly 'script kiddies') rely on others' tools/scripts — low sophistication, but still dangerous with powerful tooling." },
  { cat: "Threat Actors", q: "Employees using unapproved cloud apps to get work done are an example of:", o: ["Shadow IT", "Hacktivism", "An APT", "A logic bomb"], a: 0, e: "Shadow IT is unsanctioned hardware/software/services used without IT approval — a governance and data-leak risk." },
  { cat: "Threat Actors", q: "Which threat is typically HARDEST to detect because the actor already has legitimate access?", o: ["Malicious insider", "Script kiddie", "Hacktivist", "Unskilled attacker"], a: 0, e: "Insiders' actions blend in with normal activity. Behavior analytics (UEBA), least privilege, and separation of duties help." },
  { cat: "Threat Actors", q: "Which is a threat VECTOR rather than a threat actor?", o: ["A removable USB drive", "A hacktivist", "An APT group", "Organized crime"], a: 0, e: "A vector is the path/method of attack (email, USB, removable media, unsecured Wi-Fi). Actors are who attacks." },
  { cat: "Threat Actors", q: "Well-organized, profit-driven groups running ransomware-as-a-service are best classed as:", o: ["Organized crime", "Hacktivists", "Script kiddies", "Insiders"], a: 0, e: "Organized crime pursues profit, operating like a business (RaaS affiliates, extortion, money laundering)." },

  // ----- Application Attacks (Domain 2) -----
  { cat: "Application Attacks", q: "Tricking a logged-in user's browser into submitting an unwanted request to a trusted site is:", o: ["Cross-Site Request Forgery", "Cross-Site Scripting", "SQL injection", "Directory traversal"], a: 0, e: "CSRF rides the victim's authenticated session. Defenses: anti-CSRF tokens, SameSite cookies, re-auth for sensitive actions." },
  { cat: "Application Attacks", q: "Using ../../ sequences in a URL to read files outside the web root is:", o: ["Directory traversal", "Privilege escalation", "Buffer overflow", "Session hijacking"], a: 0, e: "Directory/path traversal navigates the filesystem to reach unauthorized files. Mitigate with input validation and canonicalization." },
  { cat: "Application Attacks", q: "Exploiting the gap between when a value is checked and when it is used is a:", o: ["Race condition", "Buffer overflow", "Replay attack", "XSS"], a: 0, e: "Time-of-check to time-of-use: state changes between validation and use. Fixed with locking/atomic operations." },
  { cat: "Application Attacks", q: "A standard user exploits a flaw to gain administrator rights. This is:", o: ["Privilege escalation", "Lateral movement", "Pivoting", "Tailgating"], a: 0, e: "Vertical privilege escalation gains higher rights; horizontal moves to another same-level account. Patching and least privilege reduce it." },
  { cat: "Application Attacks", q: "An attacker steals a session cookie to impersonate a logged-in user. This is:", o: ["Session hijacking", "CSRF", "Pharming", "Smurfing"], a: 0, e: "Session hijacking reuses a captured session token/cookie. Use HTTPS, HttpOnly/Secure cookies, and short session lifetimes." },
  { cat: "Application Attacks", q: "Coercing a server into making requests to internal resources on the attacker's behalf is:", o: ["SSRF", "CSRF", "XSS", "Clickjacking"], a: 0, e: "SSRF abuses a server to reach internal systems (e.g., cloud metadata endpoints). Validate/allow-list outbound destinations." },
  { cat: "Application Attacks", q: "The single best defense against SQL injection is:", o: ["Parameterized queries", "Longer passwords", "Disabling cookies", "Using UDP"], a: 0, e: "Parameterized queries separate code from data so input can't alter the query. Add input validation and least-privilege DB accounts." },
  { cat: "Application Attacks", q: "Feeding a program large amounts of malformed input to find crashes/flaws is:", o: ["Fuzzing", "Hashing", "Salting", "Pinning"], a: 0, e: "Fuzzing automatically sends random/invalid data to surface input-handling bugs (overflows, crashes) during testing." },

  // ----- Hardening & Endpoint (Domain 4) -----
  { cat: "Hardening & Endpoint", q: "A documented standard secure configuration to measure systems against is a:", o: ["Security baseline", "Honeypot", "Threat feed", "Playbook"], a: 0, e: "A baseline defines the approved secure config; deviations indicate drift or compromise, and tools enforce it." },
  { cat: "Hardening & Endpoint", q: "Which tool alerts when critical system files change unexpectedly?", o: ["FIM", "DHCP", "NAT", "A load balancer"], a: 0, e: "FIM hashes/monitors important files and flags unauthorized changes — useful for spotting tampering or rootkits." },
  { cat: "Hardening & Endpoint", q: "Allowing only explicitly approved programs to run is:", o: ["Application allow listing", "Deny listing", "Fuzzing", "Sandboxing"], a: 0, e: "Allow listing blocks everything not approved (strong, higher maintenance). Deny listing only blocks known-bad." },
  { cat: "Hardening & Endpoint", q: "Disabling unneeded services and closing unused ports follows which principle?", o: ["Least functionality", "Least privilege", "Separation of duties", "Implicit allow"], a: 0, e: "Least functionality reduces the attack surface to only what's required. Least privilege is about access rights." },
  { cat: "Hardening & Endpoint", q: "Which endpoint solution continuously records activity and enables threat hunting and response?", o: ["EDR", "Signature-only antivirus", "A screensaver lock", "A CRL"], a: 0, e: "Endpoint Detection and Response adds visibility, behavioral detection, and remediation beyond signature AV. XDR correlates across sources." },
  { cat: "Hardening & Endpoint", q: "Running suspicious software in an isolated environment to observe it safely is:", o: ["Sandboxing", "Hashing", "Pinning", "Tunneling"], a: 0, e: "A sandbox isolates execution so malware can't affect the host — used in malware analysis and email attachment detonation." },
  { cat: "Hardening & Endpoint", q: "Secure boot protects a system by:", o: ["Verifying boot components are signed/trusted before loading", "Encrypting network traffic", "Blocking spam", "Rotating passwords"], a: 0, e: "Secure boot (with UEFI/TPM) checks signatures of the bootloader/OS to block bootkits and rootkits from loading." },
  { cat: "Hardening & Endpoint", q: "In Windows domains, which tool centrally enforces security settings across many machines?", o: ["Group Policy", "Syslog", "OCSP", "NAT"], a: 0, e: "Group Policy Objects push standardized configuration/hardening to domain-joined systems at scale." },
  { cat: "Hardening & Endpoint", q: "Employee-owned phones used for work, managed by the company, describes which model?", o: ["BYOD", "COPE", "CYOD", "VDI"], a: 0, e: "Bring Your Own Device = employee-owned. COPE = corporate-owned, personally enabled; CYOD = choose from an approved list. An MDM enforces policy." },

  // ----- Vulnerability Management (Domain 4) -----
  { cat: "Vulnerability Management", q: "Which provides a numerical severity score (0–10) for a vulnerability?", o: ["CVSS", "CVE", "CCE", "CPE"], a: 0, e: "CVSS = Common Vulnerability Scoring System (severity). CVE = the unique identifier for a specific named vulnerability." },
  { cat: "Vulnerability Management", q: "A scan run with valid login credentials to assess a host more deeply is a:", o: ["Credentialed scan", "Non-credentialed scan", "Passive scan", "Port knock"], a: 0, e: "Credentialed scans log in to check patch levels/configs accurately, with fewer false positives — an insider's view." },
  { cat: "Vulnerability Management", q: "A penetration tester is given NO prior knowledge of the environment. This is a:", o: ["Black-box test", "White-box test", "Gray-box test", "Compliance audit"], a: 0, e: "Black-box simulates an outsider with no info. White-box = full knowledge; gray-box = partial knowledge." },
  { cat: "Vulnerability Management", q: "Paying external researchers to find and report flaws under defined rules is a:", o: ["Bug bounty program", "Red team", "Honeypot", "SLA"], a: 0, e: "Bug bounties crowdsource vulnerability discovery with rewards, under responsible-disclosure terms." },
  { cat: "Vulnerability Management", q: "A vulnerability scan flags an issue that doesn't actually exist. The analyst should:", o: ["Validate it, then document it as a false positive", "Immediately rebuild the server", "Ignore all future scans", "Disable the scanner"], a: 0, e: "Confirm via manual testing, then mark/tune it so it isn't re-reported. Don't act blindly on raw scanner output." },
  { cat: "Vulnerability Management", q: "Which exercise pits an attacking team against a defending team?", o: ["Red team vs. Blue team", "Tabletop walkthrough", "Failover test", "Gap analysis"], a: 0, e: "Red attacks, Blue defends; Purple-teaming has them collaborate to improve. A White team referees." },
  { cat: "Vulnerability Management", q: "Gathering intelligence from publicly available sources is:", o: ["Open-source intelligence", "A credentialed scan", "Pivoting", "Privilege escalation"], a: 0, e: "OSINT collects data from public sources (websites, social media, DNS, leaks) — common in reconnaissance and threat intel." },
  { cat: "Vulnerability Management", q: "Which standard automates configuration and vulnerability checking across tools?", o: ["SCAP", "SAML", "SNMP", "SOAR"], a: 0, e: "Security Content Automation Protocol standardizes how tools express/check security configs and vulns (using CVE, CVSS, CPE)." },

  // ----- Digital Forensics (Domain 4) -----
  { cat: "Digital Forensics", q: "A directive to preserve all data relevant to anticipated litigation is a:", o: ["Legal hold", "Chain of custody", "Data classification", "Retention purge"], a: 0, e: "A legal hold suspends normal deletion so potential evidence isn't destroyed. E-discovery then locates and produces it." },
  { cat: "Digital Forensics", q: "Hashing a disk image before and after analysis proves which property?", o: ["Integrity", "Confidentiality", "Availability", "Non-repudiation"], a: 0, e: "Matching hashes before/after show the evidence is unchanged, preserving integrity and court admissibility." },
  { cat: "Digital Forensics", q: "Which device lets investigators read a drive without modifying it?", o: ["Write blocker", "KVM switch", "Load balancer", "Proxy"], a: 0, e: "A hardware/software write blocker prevents any writes to the source media during acquisition." },
  { cat: "Digital Forensics", q: "Documenting where evidence came from and everyone who handled it supports:", o: ["Provenance and admissibility", "Faster CPUs", "Network segmentation", "Password rotation"], a: 0, e: "Provenance (origin + handling history) plus chain of custody keeps evidence credible and admissible in court." },
  { cat: "Digital Forensics", q: "Many regulations (e.g., GDPR's 72-hour rule) impose obligations around:", o: ["Breach reporting and disclosure timeframes", "Disk defragmentation", "DNS caching", "Load balancing"], a: 0, e: "Know your reporting/disclosure obligations in advance so you notify regulators/affected parties within required windows." },
  { cat: "Digital Forensics", q: "Which property prevents a signer from credibly denying they sent a message?", o: ["Non-repudiation", "Confidentiality", "Availability", "Obfuscation"], a: 0, e: "Digital signatures (private-key signing) provide non-repudiation, along with integrity and authentication." },

  // ----- Wireless & Mobile (Domain 3) -----
  { cat: "Wireless & Mobile", q: "An attacker sets up a fake AP using the same SSID as a legitimate one. This is an:", o: ["Evil twin", "Rogue DHCP server", "Bluesnarfing attempt", "ARP cache"], a: 0, e: "An evil twin mimics a trusted SSID to capture traffic/credentials. A rogue AP is any unauthorized AP added to the network." },
  { cat: "Wireless & Mobile", q: "Which Wi-Fi feature is commonly disabled because its PIN is easily brute-forced?", o: ["WPS", "WPA3-SAE", "802.1X", "PMF"], a: 0, e: "WPS's 8-digit PIN is vulnerable to brute force; best practice is to disable it." },
  { cat: "Wireless & Mobile", q: "Sending repeated deauthentication frames to knock clients off Wi-Fi is a:", o: ["Disassociation/deauth attack", "Replay attack", "Smurf attack", "Pharming attack"], a: 0, e: "Deauth attacks abuse management frames to disconnect clients (often to force a handshake capture). 802.11w/PMF mitigates it." },
  { cat: "Wireless & Mobile", q: "Which lets an organization enforce policy, encryption, and remote wipe on phones?", o: ["MDM", "MAC filtering", "OCSP", "NAT"], a: 0, e: "MDM/UEM centrally manages mobile devices — policy, containerization (separating work/personal data), and remote wipe." },
  { cat: "Wireless & Mobile", q: "Enterprise Wi-Fi that authenticates each user against a RADIUS server uses:", o: ["802.1X with EAP", "WPA2-PSK", "WEP", "Open authentication"], a: 0, e: "WPA2/3-Enterprise uses 802.1X/EAP with a RADIUS server for per-user authentication, versus a single shared PSK." },
  { cat: "Wireless & Mobile", q: "Driving around to locate and map wireless networks is:", o: ["War driving", "Phishing", "Pivoting", "Smishing"], a: 0, e: "War driving maps Wi-Fi from a vehicle; war flying uses drones. Used in recon to find rogue or open networks." },

  // ----- Data Protection (Domain 3) -----
  { cat: "Data Protection", q: "Replacing a credit card number with a surrogate value mapped in a secure vault is:", o: ["Tokenization", "Encryption", "Hashing", "Steganography"], a: 0, e: "Tokenization swaps sensitive data for a token with no mathematical relationship; the mapping lives in a vault. Common for PCI scope reduction." },
  { cat: "Data Protection", q: "Showing only the last 4 digits of an SSN for display is:", o: ["Data masking", "Tokenization", "Encryption", "Salting"], a: 0, e: "Masking hides parts of data for display while preserving format. It limits exposure but isn't cryptographic protection." },
  { cat: "Data Protection", q: "The three states of data are:", o: ["At rest, in transit, in use", "Public, private, secret", "Hot, warm, cold", "Raw, cooked, archived"], a: 0, e: "Protect data at rest (FDE), in transit (TLS/IPsec), and in use (memory protections, secure enclaves)." },
  { cat: "Data Protection", q: "A requirement that citizens' data be stored within the country's borders reflects:", o: ["Data sovereignty", "Data masking", "Tokenization", "Load balancing"], a: 0, e: "Data sovereignty means data is subject to the laws of the country it resides in — it drives where you may store/process it." },
  { cat: "Data Protection", q: "Irreversibly stripping identifiers so individuals can't be re-identified is:", o: ["Anonymization", "Pseudonymization", "Encryption", "Tokenization"], a: 0, e: "Anonymization is irreversible. Pseudonymization replaces identifiers but can be reversed with additional data." },
  { cat: "Data Protection", q: "Who implements the controls that the data owner specifies?", o: ["Data custodian", "Data owner", "Data subject", "Auditor"], a: 0, e: "The custodian (often IT) implements/maintains controls; the owner sets classification and is accountable; the processor handles data for a controller." },
  { cat: "Data Protection", q: "Which control most directly stops staff emailing customer PII to personal accounts?", o: ["DLP", "A firewall port block", "A TPM", "A load balancer"], a: 0, e: "Data Loss Prevention inspects content and blocks/quarantines unauthorized transfers of sensitive data across email/web/endpoints." },

  // ----- Resilience & Recovery (Domain 3) -----
  { cat: "Resilience & Recovery", q: "Which backup copies data changed since the last FULL backup (and doesn't clear the archive bit)?", o: ["Differential", "Incremental", "Full", "Snapshot"], a: 0, e: "Differential = since last full (grows daily; restore = full + one diff). Incremental = since last backup of any type (smallest; restore = full + every incremental)." },
  { cat: "Resilience & Recovery", q: "Restoring from incremental backups requires:", o: ["The last full plus every incremental in order", "Just the last full", "The last full plus one differential", "Only the latest incremental"], a: 0, e: "Incrementals are small/fast to create but you must restore the full plus each incremental in sequence." },
  { cat: "Resilience & Recovery", q: "Which recovery site is fully equipped and can take over almost immediately?", o: ["Hot site", "Warm site", "Cold site", "Mobile site"], a: 0, e: "Hot = ready/near-real-time (costly). Warm = some equipment, hours-days. Cold = space/power only, slowest and cheapest." },
  { cat: "Resilience & Recovery", q: "Which RAID level mirrors data across two disks with no parity?", o: ["RAID 1", "RAID 0", "RAID 5", "RAID 6"], a: 0, e: "RAID 1 = mirroring (redundancy). RAID 0 = striping (speed, NO redundancy). RAID 5 = striping with parity (survives 1 disk); RAID 6 survives 2." },
  { cat: "Resilience & Recovery", q: "Distributing systems across multiple regions to survive a regional outage is:", o: ["Geographic dispersion", "Vertical scaling", "Tokenization", "Port mirroring"], a: 0, e: "Geographic dispersion/diversity places replicas far apart so one disaster doesn't take down everything." },
  { cat: "Resilience & Recovery", q: "Which device gives short-term battery power for a graceful shutdown during an outage?", o: ["UPS", "Generator", "PDU", "KVM"], a: 0, e: "A UPS bridges brief outages/dips and allows safe shutdown; a generator handles longer outages. They're often used together." },
  { cat: "Resilience & Recovery", q: "Spreading requests across multiple servers for performance AND availability uses a:", o: ["Load balancer", "Forward proxy", "Jump server", "Honeypot"], a: 0, e: "A load balancer distributes traffic and removes failed nodes, supporting high availability and scalability." },

  // ----- Governance & Third-Party (Domain 5) -----
  { cat: "Governance & Third-Party", q: "Which document defines the security requirements for connecting two organizations' systems?", o: ["ISA", "NDA", "SLA", "BPA"], a: 0, e: "An ISA specifies the security controls for a system interconnection. An MOU captures broader intent; an SOW lists specific work." },
  { cat: "Governance & Third-Party", q: "A non-binding document expressing intent to work together is a(n):", o: ["MOU/MOA", "SLA", "SOW", "MSA"], a: 0, e: "A Memorandum of Understanding/Agreement states intent and is generally not legally binding, unlike contracts (MSA, SOW)." },
  { cat: "Governance & Third-Party", q: "Which document specifies exact deliverables, timeline, and tasks for a project?", o: ["SOW", "MOU", "NDA", "AUP"], a: 0, e: "A Statement of Work details specific deliverables/milestones, often under a Master Service Agreement (MSA) that sets overall terms." },
  { cat: "Governance & Third-Party", q: "Before signing with a vendor, investigating their security posture and reputation is:", o: ["Due diligence", "Due care", "Attestation", "Onboarding"], a: 0, e: "Due diligence = investigating/assessing before committing. Due care = the ongoing reasonable steps to protect once engaged." },
  { cat: "Governance & Third-Party", q: "A compromise introduced through a trusted hardware/software supplier is a:", o: ["Supply chain attack", "Watering hole", "Insider threat", "Evil twin"], a: 0, e: "Supply-chain attacks target a vendor/dependency to reach many downstream victims (e.g., poisoned updates). Vet vendors and use SBOMs." },
  { cat: "Governance & Third-Party", q: "Which policy requires employees to take time off, helping surface hidden fraud?", o: ["Mandatory vacation", "Job rotation", "Least privilege", "Onboarding"], a: 0, e: "Mandatory vacation lets someone else cover the role, exposing concealed fraud. Job rotation similarly spreads duties and detects issues." },
  { cat: "Governance & Third-Party", q: "An independent examination that produces a formal opinion on controls is a(n):", o: ["Audit", "Self-assessment", "Penetration test", "Tabletop"], a: 0, e: "Audits are formal and independent (often external, e.g., SOC 2). Assessments are typically internal and advisory." },
  { cat: "Governance & Third-Party", q: "From a security standpoint, what is the FIRST step when an employee is terminated?", o: ["Disable their accounts and revoke access", "Schedule an exit interview next month", "Archive their email after a year", "Increase their privileges"], a: 0, e: "Immediately disabling access during offboarding prevents retaliation/data theft. Then recover assets and preserve needed data." },
  { cat: "Governance & Third-Party", q: "Recurring security awareness training most reduces risk from:", o: ["Social engineering and user error", "Hardware failure", "Power outages", "Disk fragmentation"], a: 0, e: "Training builds a human firewall against phishing/social engineering — often the weakest link. Phishing simulations measure effectiveness." },
  { cat: "Governance & Third-Party", q: "A structured process to review, approve, and document system modifications is:", o: ["Change management", "Incident response", "Threat hunting", "Tokenization"], a: 0, e: "Change management reduces outages and security gaps from unplanned changes (approval, testing, rollback, documentation)." },
  { cat: "Governance & Third-Party", q: "Which agreement legally protects confidential information shared between two parties?", o: ["NDA", "SLA", "SOW", "ISA"], a: 0, e: "A Non-Disclosure Agreement binds parties to keep shared information confidential." },
  { cat: "Governance & Third-Party", q: "An SBOM (Software Bill of Materials) primarily helps an organization:", o: ["Inventory software components to assess vulnerabilities", "Encrypt all disks", "Balance network load", "Replace passwords with biometrics"], a: 0, e: "An SBOM inventories components so you can quickly assess exposure when a dependency (e.g., Log4j) turns out vulnerable." },

  // ----- Risk management (Domain 5) -----
  { cat: "Risk & Governance", q: "A central document listing identified risks, owners, and treatment status is a:", o: ["Risk register", "Asset inventory", "Playbook", "CRL"], a: 0, e: "A risk register tracks risks, likelihood/impact, owners, and responses over time." },
  { cat: "Risk & Governance", q: "The amount of risk an organization is willing to accept to meet objectives is its:", o: ["Risk appetite", "Residual risk", "Inherent risk", "Risk transfer"], a: 0, e: "Risk appetite/tolerance guides decisions. Inherent risk = before controls; residual = what remains after controls." },
  { cat: "Risk & Governance", q: "Risk that remains after controls are applied is:", o: ["Residual risk", "Inherent risk", "Total risk", "Transferred risk"], a: 0, e: "Residual risk = what's left after mitigation. The organization accepts residual risk within its appetite." },
  { cat: "Risk & Governance", q: "Which risk analysis uses subjective High/Medium/Low ratings rather than dollar figures?", o: ["Qualitative", "Quantitative", "Actuarial", "Monte Carlo"], a: 0, e: "Qualitative uses ratings/heat maps (fast, subjective). Quantitative uses numbers (SLE/ALE) and needs more data." },
  { cat: "Risk & Governance", q: "A metric that gives early warning of rising risk (e.g., a spike in failed logins) is a:", o: ["KRI", "KPI", "SLE", "RTO"], a: 0, e: "KRIs flag increasing risk exposure. KPIs measure performance toward goals." },
  { cat: "Risk & Governance", q: "Which standard specifically protects payment card data?", o: ["PCI DSS", "HIPAA", "GDPR", "SOX"], a: 0, e: "PCI DSS is a contractual standard for handling cardholder data. HIPAA=US health, GDPR=EU privacy, SOX=financial reporting." },
  { cat: "Risk & Governance", q: "Under GDPR, the entity that decides WHY and HOW personal data is processed is the:", o: ["Data controller", "Data processor", "Data custodian", "Data subject"], a: 0, e: "The controller decides purposes/means; the processor acts on its instructions; the subject is the individual the data is about." },
  { cat: "Risk & Governance", q: "A SOC 2 Type II report primarily provides:", o: ["Independent attestation of a service org's controls over a period", "A firewall ruleset", "A penetration test exploit chain", "A password policy"], a: 0, e: "SOC 2 attests to controls (security, availability, confidentiality, etc.); Type II covers operating effectiveness over time." },
  { cat: "Risk & Governance", q: "Which assessment identifies the difference between current and desired security posture?", o: ["Gap analysis", "Penetration test", "Failover test", "Tabletop exercise"], a: 0, e: "A gap analysis compares the current state to a target (e.g., a framework) to plan remediation." },
  { cat: "Risk & Governance", q: "A discussion-based exercise where the IR team verbally walks through a scenario is a:", o: ["Tabletop exercise", "Full-scale failover", "Live-system simulation", "Penetration test"], a: 0, e: "Tabletops are low-cost, discussion-based validations of the plan; simulations and full-interruption tests are more realistic but costly." },

  // ----- IAM, additional (Domain 4) -----
  { cat: "IAM", q: "Which solution vaults, monitors, and time-limits administrator credentials?", o: ["PAM", "DLP", "WAF", "SIEM"], a: 0, e: "PAM vaults privileged credentials, brokers sessions, and grants just-in-time elevated access with full logging." },
  { cat: "IAM", q: "Granting access only when the request meets conditions (device health, location, risk) is:", o: ["Conditional / context-aware access", "Mandatory access control", "Implicit allow", "Single sign-on"], a: 0, e: "Conditional access evaluates context (user, device, location, risk) per request — a core Zero Trust building block." },
  { cat: "IAM", q: "In biometrics, the point where the false acceptance and false rejection rates are equal is the:", o: ["CER", "FAR", "FRR", "TPR"], a: 0, e: "CER (a.k.a. EER) is where FAR = FRR; a lower CER means a more accurate system. FAR is the dangerous error (wrong person accepted)." },
  { cat: "IAM", q: "A 6-digit code from an authenticator app that changes every 30 seconds is:", o: ["TOTP", "HOTP", "A smart card", "A CAC"], a: 0, e: "TOTP derives a code from a shared secret + current time. HOTP is counter-based. Both are 'something you have'." },
  { cat: "IAM", q: "Promptly removing access when a user leaves or changes roles is:", o: ["Deprovisioning", "Provisioning", "Federation", "Escalation"], a: 0, e: "Deprovisioning revokes accounts/rights to prevent orphaned access. Regular access reviews/recertification catch what's missed." },
  { cat: "IAM", q: "Fake credentials or records planted specifically to detect intruders are:", o: ["Honeytokens", "Salts", "Nonces", "Wildcards"], a: 0, e: "A honeytoken is bait data; any use of it signals an intrusion, since legitimate users never touch it." },

  // ----- Security Operations, additional (Domain 4) -----
  { cat: "Security Operations", q: "Automated, repeatable response steps executed by a SOAR platform are defined in:", o: ["Playbooks", "CRLs", "CSRs", "SLAs"], a: 0, e: "Playbooks codify response workflows so SOAR can automate triage/containment, cutting response time and human error." },
  { cat: "Security Operations", q: "Proactively searching the environment for undetected threats, beyond alerts, is:", o: ["Threat hunting", "Patch management", "Tokenization", "Provisioning"], a: 0, e: "Threat hunting hypothesizes about adversary activity and looks for it in logs/telemetry, rather than waiting for an alert." },
  { cat: "Security Operations", q: "Which log source would BEST show a user successfully authenticating to a server?", o: ["Authentication/security event logs", "DNS cache", "DHCP lease file", "Printer spooler"], a: 0, e: "Security/authentication logs record logon successes/failures — central to investigations and SIEM correlation." },

  // ----- Cryptography, additional (Domain 1) -----
  { cat: "Cryptography", q: "bcrypt, PBKDF2, and Argon2 are examples of:", o: ["Key stretching algorithms", "Block ciphers", "Asymmetric ciphers", "Hash collisions"], a: 0, e: "Key stretching deliberately slows password hashing (work factor) to make cracking expensive." },
  { cat: "Cryptography", q: "Hiding a secret message inside an image or audio file is:", o: ["Steganography", "Tokenization", "Hashing", "Salting"], a: 0, e: "Steganography conceals the existence of data within other media. It's about hiding, not encrypting." },
  { cat: "Cryptography", q: "Which hashing algorithm is considered broken due to practical collisions?", o: ["MD5", "SHA-256", "SHA-3", "bcrypt"], a: 0, e: "MD5 (and SHA-1) are collision-prone and unsuitable for security. Use the SHA-2 or SHA-3 family." },
  { cat: "Cryptography", q: "Which verifies BOTH integrity and authenticity of a message using a shared secret key?", o: ["HMAC", "Base64", "CRC", "ROT13"], a: 0, e: "HMAC combines a hash with a secret key, proving the message wasn't altered and came from a key holder." },
  { cat: "Cryptography", q: "A primary advantage of symmetric over asymmetric encryption is:", o: ["Much faster for bulk data", "No keys are needed", "Easier key distribution", "Built-in non-repudiation"], a: 0, e: "Symmetric (AES) is fast for bulk encryption; its weakness is securely sharing the key — often solved with asymmetric key exchange (hybrid)." },

  // ----- Threats & Attacks, additional (Domain 2) -----
  { cat: "Threats & Attacks", q: "Poisoning a resolver so users reach a malicious IP for a legitimate domain is:", o: ["DNS poisoning / pharming", "ARP poisoning", "Smurfing", "Typosquatting"], a: 0, e: "DNS cache poisoning redirects name lookups to attacker servers. DNSSEC and integrity checks help mitigate." },
  { cat: "Threats & Attacks", q: "An attacker maps their MAC to the gateway's IP to intercept LAN traffic. This is:", o: ["ARP poisoning", "DNS poisoning", "VLAN hopping", "Smurf attack"], a: 0, e: "ARP poisoning corrupts the ARP cache to become an on-path attacker. Dynamic ARP Inspection and static entries mitigate it." },
  { cat: "Threats & Attacks", q: "Forcing a connection to use older, weaker encryption is a:", o: ["Downgrade attack", "Replay attack", "Birthday attack", "Brute force"], a: 0, e: "Downgrade attacks (e.g., POODLE) trick parties into a weaker protocol. Disable legacy SSL/TLS versions to prevent it." },
  { cat: "Threats & Attacks", q: "Flooding a switch's MAC table so it broadcasts traffic to every port is:", o: ["MAC flooding", "ARP poisoning", "VLAN hopping", "Smurfing"], a: 0, e: "MAC flooding overwhelms CAM tables, making the switch fail open (behave like a hub). Port security limits MACs per port." },

  // ----- Network Security, additional (Domain 3) -----
  { cat: "Network Security", q: "Which firewall type tracks the state of active connections?", o: ["Stateful firewall", "Stateless packet filter", "Proxy-only", "Hub"], a: 0, e: "Stateful firewalls track the session table and allow return traffic automatically; stateless filters judge each packet in isolation." },
  { cat: "Network Security", q: "What does a Next-Generation Firewall (NGFW) add over a traditional firewall?", o: ["Application awareness and IPS", "Only blocking ports", "DHCP leasing", "Disk encryption"], a: 0, e: "NGFWs inspect at the application layer, identify apps/users, and integrate IPS and threat intelligence." },
  { cat: "Network Security", q: "A server between users and the internet that filters and caches outbound web requests is a:", o: ["Forward proxy", "Reverse proxy", "Jump server", "Honeypot"], a: 0, e: "A forward proxy mediates outbound client requests (filtering/caching). A reverse proxy fronts servers for inbound requests." },
  { cat: "Network Security", q: "A hardened host used to administer devices inside a secure zone is a:", o: ["Jump server", "Honeypot", "Load balancer", "Proxy"], a: 0, e: "A jump server is a controlled, monitored pivot point for admin access into a segmented/secure network." },

  // ----- Architecture & Cloud, additional (Domain 3) -----
  { cat: "Architecture & Cloud", q: "Managing infrastructure through version-controlled configuration files is:", o: ["Infrastructure as Code", "Shadow IT", "Tokenization", "Air gapping"], a: 0, e: "IaC provisions infrastructure via code for consistency/repeatability — but misconfigurations propagate fast, so review templates." },
  { cat: "Architecture & Cloud", q: "Containers differ from virtual machines mainly because they:", o: ["Share the host OS kernel", "Each include a full guest OS", "Cannot be orchestrated", "Require a separate hypervisor per app"], a: 0, e: "Containers share the host kernel (fast, dense) but provide less isolation than VMs, which run full guest OSes on a hypervisor." },
  { cat: "Architecture & Cloud", q: "An industrial system controlling physical processes in a plant is best described as:", o: ["ICS/SCADA", "A CDN", "A honeypot", "A reverse proxy"], a: 0, e: "ICS/SCADA run critical infrastructure; they're often legacy and fragile, so segmentation and careful patching are key." },
  { cat: "Architecture & Cloud", q: "A network physically isolated with no external connections is:", o: ["Air-gapped", "Load-balanced", "Federated", "Tokenized"], a: 0, e: "Air gapping isolates a network (e.g., ICS or classified systems). Removable media then becomes the main threat vector." },
  { cat: "Architecture & Cloud", q: "Which converges networking and security (SWG, CASB, ZTNA, FWaaS) as a cloud service?", o: ["SASE", "RAID", "VLAN", "OCSP"], a: 0, e: "Secure Access Service Edge delivers networking + security from the cloud, fitting distributed/remote workforces and Zero Trust." },

  // ----- Physical Security (Domain 1) -----
  { cat: "Physical Security", q: "A two-door entry letting only one person through at a time, to stop tailgating, is a(n):", o: ["Access control vestibule", "Turnstile bypass", "Bollard", "Faraday cage"], a: 0, e: "An access control vestibule traps a person between two interlocking doors, preventing tailgating/piggybacking." },
  { cat: "Physical Security", q: "Which securely destroys data on magnetic drives by disrupting their magnetic field?", o: ["Degaussing", "Formatting", "Defragmenting", "Encrypting"], a: 0, e: "Degaussing magnetically wipes HDDs/tapes (not SSDs). Physical destruction/shredding is surest; crypto-erase works for SSDs." },
  { cat: "Physical Security", q: "Following an authorized employee through a secure door without badging is:", o: ["Tailgating", "Shoulder surfing", "Dumpster diving", "Pretexting"], a: 0, e: "Tailgating bypasses access control by trailing someone in. Mantraps, turnstiles, and awareness training reduce it." },
  { cat: "Physical Security", q: "A sensor that detects body heat to trigger an alarm is which type?", o: ["Infrared motion sensor", "Microwave jammer", "Faraday cage", "Proximity card"], a: 0, e: "Passive infrared detects heat/movement. Layering sensor types (infrared, microwave, ultrasonic) reduces false alarms and gaps." },
];

/* ---------- Performance-Based Questions (drag/match & ordering) ---------- */
const PBQS = [
  {
    type: "match",
    title: "Match the port to its service",
    prompt: "Select the correct service for each port. Two services are decoys.",
    pairs: [
      { left: "TCP 22", right: "SSH" },
      { left: "TCP 443", right: "HTTPS" },
      { left: "TCP 3389", right: "RDP" },
      { left: "UDP 53", right: "DNS" },
      { left: "TCP 636", right: "LDAPS" },
      { left: "TCP 445", right: "SMB" },
    ],
    distractors: ["Telnet", "SMTP"],
  },
  {
    type: "match",
    title: "Match the attack to its best mitigation",
    prompt: "Pick the single most effective mitigation for each attack.",
    pairs: [
      { left: "SQL injection", right: "Parameterized queries" },
      { left: "Cross-site scripting (XSS)", right: "Input validation / output encoding" },
      { left: "On-path (MITM)", right: "TLS with certificate validation" },
      { left: "Phishing", right: "Security awareness training" },
      { left: "Brute-force login", right: "Account lockout + MFA" },
      { left: "Ransomware", right: "Offline, tested backups" },
    ],
    distractors: ["Degaussing", "Air gapping"],
  },
  {
    type: "match",
    title: "Classify each security control",
    prompt: "Match each control to its category (technical, managerial, physical, operational).",
    pairs: [
      { left: "Firewall rule", right: "Technical" },
      { left: "Written security policy", right: "Managerial" },
      { left: "Bollard / door lock", right: "Physical" },
      { left: "Guard performing rounds", right: "Operational" },
    ],
    distractors: [],
  },
  {
    type: "match",
    title: "Match the access control model to its description",
    prompt: "Select the model that fits each description.",
    pairs: [
      { left: "Labels & clearances, system-enforced", right: "MAC" },
      { left: "Access granted by job role", right: "RBAC" },
      { left: "Resource owner sets permissions", right: "DAC" },
      { left: "Policy based on attributes/context", right: "ABAC" },
    ],
    distractors: [],
  },
  {
    type: "match",
    title: "Classify each cryptographic algorithm",
    prompt: "Match each algorithm to its type.",
    pairs: [
      { left: "AES", right: "Symmetric cipher" },
      { left: "RSA", right: "Asymmetric cipher" },
      { left: "SHA-256", right: "Hash function" },
      { left: "ECDHE", right: "Key exchange" },
    ],
    distractors: [],
  },
  {
    type: "order",
    title: "Order the incident response phases",
    prompt: "Number these phases 1–6 in the correct sequence.",
    items: ["Preparation", "Identification (Detection)", "Containment", "Eradication", "Recovery", "Lessons learned"],
  },
  {
    type: "order",
    title: "Order of volatility (collect first → last)",
    prompt: "Number these evidence sources from MOST volatile (1) to LEAST volatile (6).",
    items: ["CPU registers & cache", "RAM (memory)", "Swap / pagefile", "Disk (files)", "Remote logs", "Backups / archives"],
  },
];

/* ---------- Acronyms & key terms (flashcards + reference) ---------- */
const TERMS = [
  { group: "AAA & Identity", term: "AAA", def: "Authentication, Authorization, and Accounting." },
  { group: "AAA & Identity", term: "MFA", def: "Multifactor Authentication — two+ factors of different types (know/have/are)." },
  { group: "AAA & Identity", term: "SSO", def: "Single Sign-On — one login grants access to many systems." },
  { group: "AAA & Identity", term: "SAML", def: "Security Assertion Markup Language — XML-based web SSO/federation." },
  { group: "AAA & Identity", term: "RADIUS", def: "AAA protocol (UDP 1812/1813); encrypts only the password." },
  { group: "AAA & Identity", term: "TACACS+", def: "Cisco AAA (TCP 49); encrypts the whole payload, separates AAA." },
  { group: "AAA & Identity", term: "RBAC / MAC / DAC / ABAC", def: "Role- / Mandatory(label)- / Discretionary(owner)- / Attribute-based access control." },

  { group: "Crypto", term: "AES", def: "Advanced Encryption Standard — symmetric block cipher (128/192/256-bit)." },
  { group: "Crypto", term: "RSA / ECC", def: "Asymmetric algorithms (key exchange/signatures). ECC = smaller keys, mobile-friendly." },
  { group: "Crypto", term: "PKI", def: "Public Key Infrastructure — CAs, certificates, and key management." },
  { group: "Crypto", term: "TPM", def: "Trusted Platform Module — onboard chip storing keys / secure boot." },
  { group: "Crypto", term: "HSM", def: "Hardware Security Module — dedicated device for key generation/storage." },
  { group: "Crypto", term: "PFS", def: "Perfect Forward Secrecy — ephemeral keys (DHE/ECDHE) protect past sessions." },
  { group: "Crypto", term: "Salt / Nonce", def: "Random value added to hashing (salt) / used once to prevent replay (nonce)." },

  { group: "Risk & BC/DR", term: "ALE = SLE × ARO", def: "Annual Loss Expectancy. SLE = AV × EF (Exposure Factor)." },
  { group: "Risk & BC/DR", term: "RTO / RPO", def: "Recovery Time Objective (downtime tolerance) / Recovery Point Objective (data-loss tolerance)." },
  { group: "Risk & BC/DR", term: "MTBF / MTTR", def: "Mean Time Between Failures (reliability) / Mean Time To Repair (recovery)." },
  { group: "Risk & BC/DR", term: "BIA", def: "Business Impact Analysis — identifies critical functions and impacts." },
  { group: "Risk & BC/DR", term: "SLA / MOU / NDA", def: "Service Level Agreement / Memorandum of Understanding / Non-Disclosure Agreement." },

  { group: "Ops & Defense", term: "SIEM", def: "Security Information and Event Management — log aggregation/correlation/alerting." },
  { group: "Ops & Defense", term: "SOAR", def: "Security Orchestration, Automation, and Response — automated playbooks." },
  { group: "Ops & Defense", term: "DLP", def: "Data Loss Prevention — stops unauthorized data exfiltration." },
  { group: "Ops & Defense", term: "IDS / IPS", def: "Intrusion Detection (alerts) / Prevention (blocks inline)." },
  { group: "Ops & Defense", term: "WAF", def: "Web Application Firewall — filters HTTP attacks (SQLi, XSS)." },
  { group: "Ops & Defense", term: "CASB", def: "Cloud Access Security Broker — policy enforcement for cloud apps." },
  { group: "Ops & Defense", term: "EDR / XDR", def: "Endpoint / Extended Detection and Response." },
  { group: "Ops & Defense", term: "NAC", def: "Network Access Control — checks device posture before granting access (802.1X)." },

  { group: "Attacks", term: "DDoS", def: "Distributed Denial of Service — overwhelm a target from many sources." },
  { group: "Attacks", term: "MITM / On-path", def: "Attacker intercepts/alters traffic between two parties." },
  { group: "Attacks", term: "XSS / CSRF", def: "Cross-Site Scripting (inject script) / Cross-Site Request Forgery (ride a session)." },
  { group: "Attacks", term: "SQLi", def: "SQL Injection — defend with parameterized queries + input validation." },
  { group: "Attacks", term: "APT", def: "Advanced Persistent Threat — well-resourced, long-dwell adversary." },
  { group: "Attacks", term: "BEC", def: "Business Email Compromise — impersonation fraud, often wire transfers." },

  { group: "Frameworks", term: "MITRE ATT&CK", def: "Knowledge base of adversary tactics & techniques." },
  { group: "Frameworks", term: "Cyber Kill Chain", def: "Lockheed Martin model of attack stages (recon → actions on objectives)." },
  { group: "Frameworks", term: "OWASP Top 10", def: "Most critical web application security risks." },
  { group: "Frameworks", term: "Zero Trust", def: "Never trust, always verify — continuous, context-based verification." },
];
