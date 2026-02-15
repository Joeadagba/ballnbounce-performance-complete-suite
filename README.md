\# 🎯 Ball n Bounce - Complete Performance Testing Suite



\## 📋 Project Overview

Comprehensive performance testing for \[booking.ballnbounce.com](https://booking.ballnbounce.com) conducted in February 2026. This suite includes load testing, stress testing, endurance testing, and mixed workload simulations for customers, employees, and admin users.



---



\## 📊 Quick Summary



| User Type | Safe Capacity | Status | Key Finding |

|-----------|--------------|--------|-------------|

| \*\*Customers\*\* | 250 concurrent | 🟢 EXCELLENT | 3x current traffic capacity |

| \*\*Employees\*\* | 100+ concurrent | 🟢 EXCELLENT | All 11 features equally fast |

| \*\*Admins\*\* | 50 concurrent | 🟡 CAUTION | 92% failure at 100 users |

| \*\*Mixed Workload\*\* | 70C + 30E | 🟢 PRODUCTION READY | 0% errors |

| \*\*Endurance\*\* | 2 hours | 🟢 STABLE | No memory leaks |



---



\## 📁 Repository Structure





📦 BallnBounce-Performance-Tests

│

├── 📁 1. Customer Tests/

│ ├── 📁 50\_Users\_Baseline/

│ ├── 📁 100\_Users\_Load/

│ ├── 📁 150\_Users\_Capacity/

│ ├── 📁 200\_Users\_Stress/

│ ├── 📁 250\_Users\_Peak/

│ ├── 📁 300\_Users\_Degradation/

│ └── 📁 500\_Users\_Failure/

│

├── 📁 2. Employee Tests/

│ ├── 📁 20\_Users\_Baseline/

│ ├── 📁 50\_Users\_Load/

│ ├── 📁 100\_Users\_Capacity/

│ └── 📁 All\_11\_Features/

│

├── 📁 3. Admin Tests/

│ ├── 📁 10\_Users\_Baseline/

│ ├── 📁 20\_Users\_Load/

│ ├── 📁 50\_Users\_Capacity/

│ └── 📁 100\_Users\_Failure/

│

├── 📁 4. Mixed Workload/

│ └── 📁 70\_Customers\_30\_Employees/

│

├── 📁 5. Endurance Test/

│ └── 📁 2\_Hour\_Stability\_Test/

│

├── 📁 6. Final Executive Summary/

│ └── 📄 Complete\_Performance\_Report.pdf

│

└── 📄 README.md




---



\## 🔍 Detailed Findings



\### ✅ \*\*Customer Tests\*\*

| Test | Users | Error Rate | Avg Response | Verdict |

|------|-------|------------|--------------|---------|

| Baseline | 50 | 0.00% | 123ms | 🟢 PASS |

| Load | 100 | 0.00% | 238ms | 🟢 PASS |

| Capacity | 150 | 0.00% | 190ms | 🟢 PASS |

| Stress | 200 | 0.00% | 219ms | 🟢 PASS |

| Peak | 250 | 0.00% | 200ms | 🟢 PASS |

| Degradation | 300 | 1.25% | 211ms | 🟡 WARNING |

| Failure | 500 | 76.72% | 1310ms | 🔴 FAIL |



\### ✅ \*\*Employee Tests\*\*

\- \*\*20 Users:\*\* 0% errors, 167ms avg

\- \*\*50 Users:\*\* 0% errors, 204ms avg

\- \*\*100 Users:\*\* 0% errors, 219ms avg

\- \*\*All 11 Features:\*\* 132-146ms response (all equally fast!)



\### ⚠️ \*\*Admin Tests\*\*

\- \*\*10-50 Users:\*\* 0% errors, perfect performance

\- \*\*100 Users:\*\* 92.5% authentication failure rate

\- \*\*Critical Finding:\*\* Supabase applies stricter rate limits to admin accounts



\### ✅ \*\*Mixed Workload (70 Customers + 30 Employees)\*\*

\- \*\*Error Rate:\*\* 0.00%

\- \*\*Avg Response:\*\* ~300ms

\- \*\*Verdict:\*\* Production ready!



\### ✅ \*\*Endurance Test (2 Hours)\*\*

\- \*\*Customers:\*\* 0.36-0.71% errors (stable)

\- \*\*Employees:\*\* <1% errors (stable)

\- \*\*Admins:\*\* 92.5% auth failure (persistent)

\- \*\*No memory leaks detected\*\*

\- \*\*No performance degradation over time\*\*



---



\## 🚨 Critical Finding



\*\*Admin authentication is severely rate-limited by Supabase.\*\*



| Metric | 50 Admins | 100 Admins |

|--------|-----------|------------|

| Auth Error Rate | 0.00% | 92.5% |

| Max Response | 1.4 sec | 21.5 sec |



\*\*Recommendation:\*\* Maximum safe concurrent admins = \*\*10-15 users\*\*. Contact Supabase to increase rate limits.



---



\## 🚀 How to View Reports



1\. Navigate to any test folder

2\. Open the HTML report folder

3\. Double-click `index.html`

4\. View interactive dashboard in your browser



All reports are self-contained and require no internet connection.



---



\## 🛠️ Tools Used



\- \*\*Apache JMeter 5.6.3\*\* - Load testing

\- \*\*Supabase Auth API\*\* - Authentication testing

\- \*\*GitHub Actions\*\* - CI/CD pipeline

\- \*\*Windows 11\*\* - Test environment



---



\## 📅 Testing Timeline



\*\*Period:\*\* February 5-12, 2026  

\*\*Total Requests:\*\* 500,000+  

\*\*Test Types:\*\* Load, Stress, Endurance, Mixed Workload



---



\## 📞 Contact



For questions about this testing suite, contact:



\*\*Tester:\*\* \[Your Name]  

\*\*Repository:\*\* \[Your GitHub URL]



---



\## 📄 License



This test suite is for internal use and demonstration purposes.



---



\*\*⭐ If you find this useful, consider starring the repository!\*\*





