
// ===== LANGUAGE STATE =====
let LANG = localStorage.getItem('spring-lang') || 'ar';

function setLang(lang) {
  LANG = lang;
  localStorage.setItem('spring-lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.getElementById('btn-ar').classList.toggle('active', lang === 'ar');
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('sidebar-subtitle').textContent = lang === 'ar'
    ? '14 جلسة | 28 ساعة | Backend كامل'
    : '14 Sessions | 28 Hours | Full Backend';
  rebuildAll();
}

// ===== HELPERS =====
function L(ar, en) { return LANG === 'ar' ? ar : en; }

function hero(s, num) {
  const sess = L(s.ar, s.en);
  return `<div class="session-hero" data-session="${num}">
  <div class="session-badge">${L('جلسة','Session')} ${s.id} ${L('من','of')} 14</div>
  <h2>${sess.title}</h2><p>${sess.subtitle}</p>
  <div class="session-meta">
    <span class="meta-tag"><span class="meta-dot" style="background:#00d4ff"></span>${sess.duration}</span>
    <span class="meta-tag"><span class="meta-dot" style="background:#00ff9d"></span>${sess.badge}</span>
    <span class="meta-tag"><span class="meta-dot" style="background:#a78bfa"></span>${sess.topics}</span>
  </div></div>`;
}

function quizBlock(id, titleAr, titleEn) {
  return `<div class="divider"></div>
  <div class="teach-section"><h3><span class="icon" style="background:rgba(245,158,11,0.1);">📝</span> ${L(titleAr, titleEn)}</h3>
  <p style="color:var(--text2);font-size:13px;margin-bottom:20px;">${L('أجب على الأسئلة التالية. كل سؤال له شرح تفصيلي بعد الإجابة.','Answer the following questions. Each has a detailed explanation after answering.')}</p>
  <div id="quiz-${id}" class="quiz-container"></div></div>`;
}

// ===== SESSIONS ARRAY (bilingual) =====
const sessions = [
  {id:1,type:'learn',ar:{title:"إعداد البيئة + أول API",subtitle:"من الصفر إلى أول endpoint شغّال على جهازك",badge:"مبتدئ",duration:"2 ساعة",topics:"JDK · Maven · Spring Initializr · @RestController"},en:{title:"Setup + First API",subtitle:"From zero to your first running endpoint",badge:"Beginner",duration:"2 Hours",topics:"JDK · Maven · Spring Initializr · @RestController"}},
  {id:2,type:'learn',ar:{title:"REST API الكامل",subtitle:"GET · POST · PUT · DELETE مع كل التفاصيل",badge:"مبتدئ",duration:"2 ساعة",topics:"@GetMapping · @PostMapping · @RequestBody · ResponseEntity"},en:{title:"Full REST API",subtitle:"GET · POST · PUT · DELETE with all details",badge:"Beginner",duration:"2 Hours",topics:"@GetMapping · @PostMapping · @RequestBody · ResponseEntity"}},
  {id:3,type:'learn',ar:{title:"قاعدة البيانات مع JPA",subtitle:"ربط Spring بـ MySQL وتخزين البيانات",badge:"مبتدئ",duration:"2 ساعة",topics:"@Entity · JpaRepository · H2 · MySQL · CRUD"},en:{title:"Database with JPA",subtitle:"Connect Spring to MySQL and persist data",badge:"Beginner",duration:"2 Hours",topics:"@Entity · JpaRepository · H2 · MySQL · CRUD"}},
  {id:4,type:'learn',ar:{title:"Service Layer + DTO",subtitle:"هيكلة صحيحة للكود",badge:"متوسط",duration:"2 ساعة",topics:"@Service · DTO · Business Logic · Layered Architecture"},en:{title:"Service Layer + DTO",subtitle:"Proper code architecture",badge:"Intermediate",duration:"2 Hours",topics:"@Service · DTO · Business Logic · Layered Architecture"}},
  {id:5,type:'learn',ar:{title:"معالجة الأخطاء",subtitle:"ردود احترافية عند الأخطاء",badge:"متوسط",duration:"2 ساعة",topics:"@ExceptionHandler · @ControllerAdvice · HTTP Codes"},en:{title:"Error Handling",subtitle:"Professional error responses",badge:"Intermediate",duration:"2 Hours",topics:"@ExceptionHandler · @ControllerAdvice · HTTP Codes"}},
  {id:6,type:'learn',ar:{title:"Spring Security الأساسي",subtitle:"حماية الـ API",badge:"متوسط",duration:"2 ساعة",topics:"Authentication · Authorization · BCrypt · Roles"},en:{title:"Spring Security Basics",subtitle:"Securing your API",badge:"Intermediate",duration:"2 Hours",topics:"Authentication · Authorization · BCrypt · Roles"}},
  {id:7,type:'learn',ar:{title:"JWT و Stateless Auth",subtitle:"نظام تسجيل دخول احترافي بتوكنز",badge:"متوسط",duration:"2 ساعة",topics:"JWT · Filter Chain · Refresh Token"},en:{title:"JWT & Stateless Auth",subtitle:"Professional token-based authentication",badge:"Intermediate",duration:"2 Hours",topics:"JWT · Filter Chain · Refresh Token"}},
  {id:8,type:'learn',ar:{title:"الاختبارات Unit & Integration",subtitle:"كود موثوق لا يكسر في Production",badge:"تطبيق",duration:"2 ساعة",topics:"JUnit 5 · Mockito · @WebMvcTest · MockMvc"},en:{title:"Unit & Integration Testing",subtitle:"Reliable code that doesn't break in production",badge:"Applied",duration:"2 Hours",topics:"JUnit 5 · Mockito · @WebMvcTest · MockMvc"}},
  {id:9,type:'learn',ar:{title:"Pagination + Validation",subtitle:"API جاهز للـ Production",badge:"تطبيق",duration:"2 ساعة",topics:"@Valid · Pageable · Sorting · Bean Validation"},en:{title:"Pagination + Validation",subtitle:"Production-ready API",badge:"Applied",duration:"2 Hours",topics:"@Valid · Pageable · Sorting · Bean Validation"}},
  {id:10,type:'learn',ar:{title:"Docker + Deployment",subtitle:"نشر المشروع على السحابة",badge:"تطبيق",duration:"2 ساعة",topics:"Dockerfile · docker-compose · Profiles · Cloud"},en:{title:"Docker + Deployment",subtitle:"Deploy your project to the cloud",badge:"Applied",duration:"2 Hours",topics:"Dockerfile · docker-compose · Profiles · Cloud"}},
  {id:11,type:'project',ar:{title:"🛒 مشروع: Product API (Advanced)",subtitle:"حلول Enterprise للبحث والـ N+1 Problem",badge:"متقدم",duration:"2 ساعة",topics:"Criteria API · @Cacheable · @EntityGraph (N+1) · Redis"},en:{title:"🛒 Project: Product API (Advanced)",subtitle:"Enterprise solutions for search and N+1",badge:"Advanced",duration:"2 Hours",topics:"Criteria API · @Cacheable · @EntityGraph (N+1) · Redis"}},
  {id:12,type:'project',ar:{title:"🛒 مشروع: Cart + Orders (Advanced)",subtitle:"معالجة السباق بين المستخدمين (Race Conditions)",badge:"متقدم",duration:"2 ساعة",topics:"Optimistic Locking (@Version) · Event Publishing · Transaction Isolation"},en:{title:"🛒 Project: Cart + Orders (Advanced)",subtitle:"Handling user race conditions",badge:"Advanced",duration:"2 Hours",topics:"Optimistic Locking (@Version) · Event Publishing · Transaction Isolation"}},
  {id:13,type:'project',ar:{title:"🛒 مشروع: Auth + Payment (Advanced)",subtitle:"تأمين الويب هوكس والـ Refresh Tokens",badge:"متقدم",duration:"2 ساعة",topics:"OAuth2 · Refresh Tokens · Stripe Webhooks · HMAC Signatures"},en:{title:"🛒 Project: Auth + Payment (Advanced)",subtitle:"Securing Webhooks and Refresh Tokens",badge:"Advanced",duration:"2 Hours",topics:"OAuth2 · Refresh Tokens · Stripe Webhooks · HMAC Signatures"}},
  {id:14,type:'project',ar:{title:"🛒 مشروع: Admin + Deploy (Advanced)",subtitle:"مراقبة السيرفر والهجرة بقواعد البيانات",badge:"متقدم",duration:"2 ساعة",topics:"Flyway Migrations · Prometheus/Grafana · CI/CD · Distributed Tracing"},en:{title:"🛒 Project: Admin + Deploy (Advanced)",subtitle:"Server monitoring and Database Migrations",badge:"Advanced",duration:"2 Hours",topics:"Flyway Migrations · Prometheus/Grafana · CI/CD · Distributed Tracing"}},
];

// ===== QUIZ DATA (bilingual — ar + en per question) =====
const quiz1 = {questions:[
  {ar:{q:"ما هو الـ JDK وما الفرق بينه وبين الـ JRE؟",opts:["JDK = أدوات التطوير الكاملة (مترجم + تشغيل)، JRE = تشغيل فقط","JRE = أدوات التطوير، JDK = تشغيل فقط","لا فرق بينهما","JDK للـ Windows فقط"],explanation:"JDK يحتوي على كل شيء: مترجم javac + JRE + أدوات debug. JRE للتشغيل فقط."},en:{q:"What is JDK and how does it differ from JRE?",opts:["JDK = full dev tools (compiler + runtime), JRE = runtime only","JRE = dev tools, JDK = runtime only","No difference","JDK is for Windows only"],explanation:"JDK contains everything: javac compiler + JRE + debug tools. JRE is runtime only."},correct:0},
  {ar:{q:"ما وظيفة @SpringBootApplication؟",opts:["تُشغّل قاعدة البيانات فقط","تجمع ثلاث annotations: @Configuration + @EnableAutoConfiguration + @ComponentScan","تُعرّف الـ API endpoints","تضبط إعدادات الأمان"],explanation:"@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan."},en:{q:"What does @SpringBootApplication do?",opts:["Starts the database only","Combines three annotations: @Configuration + @EnableAutoConfiguration + @ComponentScan","Defines API endpoints","Configures security"],explanation:"@SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan."},correct:1},
  {ar:{q:"أضفت @RestController لكلاس لكن الـ endpoint لا يعمل. ما السبب الأرجح؟",opts:["يجب استخدام @Controller","الـ class ليس في نفس الـ package أو sub-package الخاص بالـ main class","يجب إضافة @Autowired للـ method","لا يمكن إرجاع String"],explanation:"@ComponentScan تبحث عن الـ components في نفس الـ package والـ sub-packages."},en:{q:"Added @RestController but the endpoint doesn't work. Most likely cause?",opts:["Must use @Controller","The class is not in the same package or sub-package as the main class","Must add @Autowired to the method","Cannot return String"],explanation:"@ComponentScan searches for components in the same package and sub-packages."},correct:1},
  {ar:{q:"في pom.xml ما وظيفة spring-boot-starter-web؟",opts:["يضيف قاعدة بيانات H2","يُضمّن Tomcat + Spring MVC + Jackson كلها معًا","يضيف Spring Security","يُفعّل الـ hot reload فقط"],explanation:"spring-boot-starter-web يُدرج: Embedded Tomcat + Spring MVC + Jackson."},en:{q:"What does spring-boot-starter-web do in pom.xml?",opts:["Adds H2 database","Includes Tomcat + Spring MVC + Jackson all together","Adds Spring Security","Enables hot reload only"],explanation:"spring-boot-starter-web includes: Embedded Tomcat + Spring MVC + Jackson."},correct:1},
  {ar:{q:"ما الـ port الافتراضي لـ Spring Boot؟",opts:["Port 3000","Port 8080، يتغير بـ server.port","Port 443","Port 80"],explanation:"Spring Boot يعمل افتراضيًا على port 8080."},en:{q:"What is the default port for Spring Boot?",opts:["Port 3000","Port 8080, changeable via server.port","Port 443","Port 80"],explanation:"Spring Boot runs on port 8080 by default."},correct:1},
  {ar:{q:"ما الفرق بين @GetMapping و @RequestMapping(method=GET)؟",opts:["@GetMapping أسرع","لا فرق — @GetMapping اختصار مريح","@RequestMapping للـ class فقط","@GetMapping تُرجع JSON دائمًا"],explanation:"@GetMapping هي shortcut لـ @RequestMapping(method=RequestMethod.GET)."},en:{q:"Difference between @GetMapping and @RequestMapping(method=GET)?",opts:["@GetMapping is faster","No difference — @GetMapping is a convenient shortcut","@RequestMapping is class-level only","@GetMapping always returns JSON"],explanation:"@GetMapping is a shortcut for @RequestMapping(method=RequestMethod.GET)."},correct:1},
  {ar:{q:"ظهر خطأ Port 8080 was already in use — ما الحل؟",opts:["الـ pom.xml فيه خطأ","الـ port مستخدم — غيّر الـ port أو أوقف التطبيق الآخر","أعد تثبيت Java","@SpringBootApplication مفقودة"],explanation:"port 8080 محجوز. غيّر الـ port بـ server.port=8081."},en:{q:"Error: Port 8080 was already in use — how to fix?",opts:["pom.xml has an error","Port is in use — change the port or stop the other app","Reinstall Java","@SpringBootApplication is missing"],explanation:"Port 8080 is taken. Change it with server.port=8081."},correct:1},
  {ar:{q:"ما هو Maven؟",opts:["هو IDE","هو أداة بناء (build tool): يدير dependencies ويُجمّع المشروع","هو framework","هو قاعدة بيانات"],explanation:"Maven هو build tool يقوم بتنزيل الـ dependencies وتجميع الكود وبناء الـ JAR."},en:{q:"What is Maven?",opts:["An IDE","A build tool: manages dependencies and builds the project","A framework","A database"],explanation:"Maven is a build tool that downloads dependencies, compiles code, and builds JARs."},correct:1},
  {ar:{q:"أول شيء بعد إنشاء مشروع Spring Initializr؟",opts:["حذف الـ pom.xml","تشغيل المشروع كما هو للتأكد من الإعداد","إنشاء قاعدة بيانات","إضافة كل الـ dependencies"],explanation:"شغّل المشروع الفارغ أولًا للتأكد."},en:{q:"First thing after creating a Spring Initializr project?",opts:["Delete pom.xml","Run it as-is to verify the setup works","Create a database","Add all dependencies"],explanation:"Run the empty project first to verify the setup."},correct:1},
  {ar:{q:"متى يُرجع endpoint نص بدلاً من JSON؟",opts:["دائمًا JSON","يُرجع نص عادي لأن نوع الإرجاع String","يُرجع HTML","يُرجع خطأ"],explanation:"عندما تُرجع String يُرسلها Spring كـ plain text. عندما تُرجع Object يُحوّلها لـ JSON."},en:{q:"When does an endpoint return text instead of JSON?",opts:["Always JSON","Returns plain text because return type is String","Returns HTML","Returns an error"],explanation:"When you return String, Spring sends it as plain text. When you return an Object, it converts to JSON."},correct:1}
]};

const quiz2 = {questions:[
  {ar:{q:"ما الفرق بين @Controller و @RestController؟",opts:["@RestController لصفحات HTML فقط","@RestController = @Controller + @ResponseBody — للـ APIs","@Controller أسرع","لا فرق"],explanation:"@RestController يضع @ResponseBody تلقائياً."},en:{q:"Difference between @Controller and @RestController?",opts:["@RestController is for HTML only","@RestController = @Controller + @ResponseBody — for APIs","@Controller is faster","No difference"],explanation:"@RestController adds @ResponseBody automatically."},correct:1},
  {ar:{q:"ما وظيفة @PathVariable؟",opts:["تأخذ القيمة من Query Params","تأخذ القيمة من URL path مثل /users/{id}","تأخذ من Body","تغيّر اسم endpoint"],explanation:"@PathVariable تستخرج من مسار الـ URL."},en:{q:"What does @PathVariable do?",opts:["Gets value from Query Params","Gets value from URL path like /users/{id}","Gets from Body","Changes endpoint name"],explanation:"@PathVariable extracts values from the URL path."},correct:1},
  {ar:{q:"أي HTTP Method لتحديث مورد بالكامل؟",opts:["GET","POST","PUT","DELETE"],explanation:"PUT للتحديث الكامل. PATCH للجزئي."},en:{q:"Which HTTP Method for full resource update?",opts:["GET","POST","PUT","DELETE"],explanation:"PUT for full update. PATCH for partial."},correct:2},
  {ar:{q:"ما فائدة ResponseEntity<T>؟",opts:["تجعله أسرع","تحكم كامل في Response (Body + Headers + Status)","للأخطاء فقط","تُجبر إرجاع نص"],explanation:"ResponseEntity = wrapper لتحديد Status Code, Headers, Body."},en:{q:"What is ResponseEntity<T> for?",opts:["Makes it faster","Full control over Response (Body + Headers + Status)","For errors only","Forces text return"],explanation:"ResponseEntity = wrapper to set Status Code, Headers, Body."},correct:1},
  {ar:{q:"أين يتم إرسال بيانات @RequestBody؟",opts:["في الـ URL","في الـ Headers","في HTTP Request Body (JSON)","في Properties"],explanation:"@RequestBody تأخذ البيانات من جسم الطلب."},en:{q:"Where does @RequestBody data come from?",opts:["From the URL","From Headers","From HTTP Request Body (JSON)","From Properties"],explanation:"@RequestBody takes data from the request body."},correct:2},
  {ar:{q:"ما Status Code لإنشاء مورد جديد؟",opts:["200 OK","201 Created","204 No Content","400 Bad Request"],explanation:"201 Created عند إنشاء مورد جديد."},en:{q:"Status Code for creating a new resource?",opts:["200 OK","201 Created","204 No Content","400 Bad Request"],explanation:"201 Created when a new resource is created."},correct:1},
  {ar:{q:"كيف نمرر ?role=admin في Spring؟",opts:["@PathVariable","@RequestParam","@RequestBody","@Service"],explanation:"@RequestParam لاستقبال Query Parameters."},en:{q:"How to pass ?role=admin in Spring?",opts:["@PathVariable","@RequestParam","@RequestBody","@Service"],explanation:"@RequestParam receives Query Parameters."},correct:1},
  {ar:{q:"ما وظيفة مكتبة Jackson؟",opts:["إدارة قواعد البيانات","تحويل Java ↔ JSON تلقائياً","تشفير كلمات المرور","تشغيل Tomcat"],explanation:"Jackson: Serialization/Deserialization."},en:{q:"What does Jackson do?",opts:["Manages databases","Converts Java ↔ JSON automatically","Encrypts passwords","Runs Tomcat"],explanation:"Jackson: Serialization/Deserialization."},correct:1},
  {ar:{q:"ماذا يمثل Status Code 404؟",opts:["نجاح","خطأ سيرفر","المورد غير موجود","طلب غير صحيح"],explanation:"404 = Not Found."},en:{q:"What does Status Code 404 mean?",opts:["Success","Server error","Resource not found","Bad request"],explanation:"404 = Not Found."},correct:2},
  {ar:{q:"أي annotation لحذف مورد؟",opts:["@RemoveMapping","@DeleteMapping","@PostMapping","@ClearMapping"],explanation:"@DeleteMapping للحذف."},en:{q:"Which annotation to delete a resource?",opts:["@RemoveMapping","@DeleteMapping","@PostMapping","@ClearMapping"],explanation:"@DeleteMapping for deletion."},correct:1}
]};

const quiz3 = {questions:[
  {ar:{q:"ما وظيفة @Entity في JPA؟",opts:["تُعرّف endpoint","تُخبر JPA أن هذا الكلاس = جدول","تُضيف أمان","تُنشئ DTO"],explanation:"@Entity تُحوّل كلاس لجدول."},en:{q:"What does @Entity do in JPA?",opts:["Defines endpoint","Tells JPA this class = a table","Adds security","Creates DTO"],explanation:"@Entity maps a class to a DB table."},correct:1},
  {ar:{q:"ما وظيفة @Id و @GeneratedValue؟",opts:["تُعرّف اسم الجدول","@Id = Primary Key، @GeneratedValue = تلقائي","تُضيف index","تُحدد نوع البيانات"],explanation:"@Id = PK, @GeneratedValue = auto increment."},en:{q:"What do @Id and @GeneratedValue do?",opts:["Define table name","@Id = Primary Key, @GeneratedValue = auto-generated","Add index","Define data type"],explanation:"@Id = PK, @GeneratedValue = auto increment."},correct:1},
  {ar:{q:"ما هو JpaRepository؟",opts:["Repository يدوي","Interface جاهز يوفر CRUD بدون SQL","Plugin لـ IntelliJ","نوع قاعدة بيانات"],explanation:"JpaRepository يوفر save, findById, findAll, deleteById."},en:{q:"What is JpaRepository?",opts:["Manual repository","Ready interface providing CRUD without SQL","IntelliJ plugin","A database type"],explanation:"JpaRepository provides save, findById, findAll, deleteById."},correct:1},
  {ar:{q:"ما هي قاعدة بيانات H2؟",opts:["قاعدة cloud فقط","قاعدة in-memory خفيفة للتطوير","نسخة من MySQL","أداة migration"],explanation:"H2 تعمل في الذاكرة وتُحذف عند الإيقاف."},en:{q:"What is H2 database?",opts:["Cloud only DB","Lightweight in-memory DB for development","Copy of MySQL","Migration tool"],explanation:"H2 runs in memory and is destroyed on stop."},correct:1},
  {ar:{q:"كيف تربط Spring Boot بـ MySQL؟",opts:["بتعديل pom.xml فقط","dependency + إعدادات spring.datasource","بتثبيت برنامج خاص","لا يمكن"],explanation:"تحتاج dependency + إعدادات في application.properties."},en:{q:"How to connect Spring Boot to MySQL?",opts:["Edit pom.xml only","dependency + spring.datasource settings","Install special software","Not possible"],explanation:"Need dependency + settings in application.properties."},correct:1},
  {ar:{q:"ما معنى spring.jpa.hibernate.ddl-auto=update؟",opts:["يحذف ويعيد إنشاء الجداول","يُحدّث البنية دون حذف البيانات","يمنع أي تغيير","يُنشئ backup"],explanation:"update يُعدّل الجداول بدون حذف بيانات."},en:{q:"What does ddl-auto=update mean?",opts:["Drops and recreates tables","Updates schema without deleting data","Prevents any change","Creates backup"],explanation:"update modifies tables without deleting data."},correct:1},
  {ar:{q:"ما الفرق بين findById و getById؟",opts:["لا فرق","findById تُرجع Optional، getById تُرجع proxy","findById أبطأ","getById محذوفة"],explanation:"findById = Optional<Entity>. getById = lazy proxy."},en:{q:"Difference between findById and getById?",opts:["No difference","findById returns Optional, getById returns proxy","findById is slower","getById is removed"],explanation:"findById = Optional<Entity>. getById = lazy proxy."},correct:1},
  {ar:{q:"ما وظيفة @Column(nullable=false)؟",opts:["Primary Key","تمنع NULL","تُضيف index","تُحدد الافتراضي"],explanation:"@Column(nullable=false) = NOT NULL."},en:{q:"What does @Column(nullable=false) do?",opts:["Primary Key","Prevents NULL","Adds index","Sets default"],explanation:"@Column(nullable=false) = NOT NULL."},correct:1},
  {ar:{q:"كيف تكتب query مخصص في JpaRepository؟",opts:["SQL في ملف منفصل","method باسم مثل findByTitleContaining","تعدّل JpaRepository","لا يمكن"],explanation:"Spring Data JPA يُحلل اسم الـ method."},en:{q:"How to write custom query in JpaRepository?",opts:["SQL in separate file","Method named like findByTitleContaining","Modify JpaRepository","Not possible"],explanation:"Spring Data JPA parses the method name."},correct:1},
  {ar:{q:"ما الـ annotation لعلاقة One-to-Many؟",opts:["@OneToMany","@ManyRelation","@HasMany","@RelatedTo"],explanation:"@OneToMany لعلاقة واحد-لكثير."},en:{q:"Annotation for One-to-Many relationship?",opts:["@OneToMany","@ManyRelation","@HasMany","@RelatedTo"],explanation:"@OneToMany for one-to-many relationships."},correct:0}
]};

const quiz4 = {questions:[
  {ar:{q:"لماذا نستخدم Service Layer؟",opts:["لزيادة عدد الملفات","لفصل Business Logic عن Controller","لتسريع التطبيق","لإضافة أمان فقط"],explanation:"Service يفصل المنطق ويسهّل الاختبار."},en:{q:"Why use a Service Layer?",opts:["To increase file count","To separate Business Logic from Controller","To speed up the app","For security only"],explanation:"Service separates logic and simplifies testing."},correct:1},
  {ar:{q:"ما وظيفة @Service؟",opts:["تُعرّف endpoint","تُسجّل الكلاس كـ Bean في طبقة الخدمات","تُضيف validation","تُنشئ جدول"],explanation:"@Service = @Component متخصصة لـ Business Logic."},en:{q:"What does @Service do?",opts:["Defines endpoint","Registers the class as a service layer Bean","Adds validation","Creates table"],explanation:"@Service = specialized @Component for Business Logic."},correct:1},
  {ar:{q:"ما هو الـ DTO؟",opts:["نوع قاعدة بيانات","كائن لنقل البيانات — يُخفي تفاصيل Entity","Framework","أداة اختبار"],explanation:"DTO يمنع تسريب بنية Entity."},en:{q:"What is a DTO?",opts:["A database type","Data transfer object — hides Entity details","A framework","Testing tool"],explanation:"DTO prevents Entity structure leaks."},correct:1},
  {ar:{q:"لماذا لا نُرجع Entity مباشرة؟",opts:["لأنها بطيئة","قد تكشف بيانات حساسة وتُسبب مشاكل","لا تتحول لـ JSON","Spring يمنع"],explanation:"Entity قد تكشف حقول حساسة وتسبب infinite recursion."},en:{q:"Why not return Entity directly?",opts:["It's slow","May expose sensitive data and cause issues","Can't convert to JSON","Spring prevents it"],explanation:"Entity may expose sensitive fields and cause infinite recursion."},correct:1},
  {ar:{q:"كيف نحوّل Entity إلى DTO؟",opts:["تلقائياً","method يدوية أو MapStruct","@Convert","لا يمكن"],explanation:"يدوياً أو بمكتبات مثل MapStruct."},en:{q:"How to convert Entity to DTO?",opts:["Automatically","Manual method or MapStruct","@Convert","Not possible"],explanation:"Manually or with libraries like MapStruct."},correct:1},
  {ar:{q:"ما هو Dependency Injection؟",opts:["تثبيت dependencies","Spring يُنشئ الكائنات ويحقنها تلقائياً","Design Pattern UI","طريقة لحذف كائنات"],explanation:"DI: Spring ينشئ الكائنات ويحقنها."},en:{q:"What is Dependency Injection?",opts:["Installing dependencies","Spring creates objects and injects them automatically","UI Design Pattern","Way to delete objects"],explanation:"DI: Spring creates and injects objects."},correct:1},
  {ar:{q:"ما الفرق بين @Autowired على Constructor vs Field؟",opts:["لا فرق","Constructor أفضل — dependencies واضحة","Field أفضل","كلاهما ممنوع"],explanation:"Constructor Injection = best practice."},en:{q:"@Autowired on Constructor vs Field?",opts:["No difference","Constructor is better — dependencies are explicit","Field is better","Both are forbidden"],explanation:"Constructor Injection = best practice."},correct:1},
  {ar:{q:"ما هو Layered Architecture؟",opts:["تصميم UI","Controller → Service → Repository","أسلوب تشفير","نوع DB"],explanation:"كل طبقة لها مسؤولية."},en:{q:"What is Layered Architecture?",opts:["UI design","Controller → Service → Repository","Encryption method","A DB type"],explanation:"Each layer has its responsibility."},correct:1},
  {ar:{q:"هل يمكن لـ Controller استدعاء Repository مباشرة؟",opts:["نعم ويُفضل","تقنياً نعم لكنه Anti-Pattern","لا يمكن تقنياً","للاختبارات فقط"],explanation:"Controller لا يجب أن يعرف تفاصيل DB."},en:{q:"Can Controller call Repository directly?",opts:["Yes and preferred","Technically yes but it's an Anti-Pattern","Not technically possible","For tests only"],explanation:"Controller shouldn't know DB details."},correct:1},
  {ar:{q:"ما الـ annotation لتعريف bean مخصص؟",opts:["@Service","@Bean","@Component","@Entity"],explanation:"@Bean داخل @Configuration class."},en:{q:"Annotation to define a custom bean?",opts:["@Service","@Bean","@Component","@Entity"],explanation:"@Bean inside @Configuration class."},correct:1}
]};

const quiz5 = {questions:[
  {ar:{q:"ما وظيفة @ControllerAdvice؟",opts:["تُضيف endpoints","Global Exception Handler لكل Controllers","تُسرّع","تُضيف logging"],explanation:"@ControllerAdvice = معالج أخطاء مركزي."},en:{q:"What does @ControllerAdvice do?",opts:["Adds endpoints","Global Exception Handler for all Controllers","Speeds up","Adds logging"],explanation:"@ControllerAdvice = centralized error handler."},correct:1},
  {ar:{q:"ما وظيفة @ExceptionHandler؟",opts:["تمنع الأخطاء","تُعالج نوع معين من الاستثناءات","تُنشئ log","تعيد تشغيل التطبيق"],explanation:"@ExceptionHandler تلتقط نوع محدد من الخطأ."},en:{q:"What does @ExceptionHandler do?",opts:["Prevents errors","Handles a specific exception type","Creates log","Restarts app"],explanation:"@ExceptionHandler catches a specific error type."},correct:1},
  {ar:{q:"أفضل Status Code عندما لا يُوجد المورد؟",opts:["200","500","404 Not Found","401"],explanation:"404 = Not Found."},en:{q:"Best Status Code when resource not found?",opts:["200","500","404 Not Found","401"],explanation:"404 = Not Found."},correct:2},
  {ar:{q:"لماذا Custom Exception؟",opts:["أسرع","رسائل واضحة ومعالجة محددة","RuntimeException محذوفة","لا يوجد سبب"],explanation:"Custom Exception = تحكم دقيق."},en:{q:"Why Custom Exception?",opts:["Faster","Clear messages and specific handling","RuntimeException removed","No reason"],explanation:"Custom Exception = precise control."},correct:1},
  {ar:{q:"ما هو ErrorResponse الموحد؟",opts:["نص عادي","JSON: timestamp, status, message, path","Header خاص","ملف log"],explanation:"ErrorResponse الموحد = ردود خطأ متسقة."},en:{q:"What is a unified ErrorResponse?",opts:["Plain text","JSON: timestamp, status, message, path","Special header","Log file"],explanation:"Unified ErrorResponse = consistent error responses."},correct:1},
  {ar:{q:"ما الفرق بين 400 و 500؟",opts:["لا فرق","400 = خطأ عميل، 500 = خطأ سيرفر","400 أخطر","500 = نجاح جزئي"],explanation:"4xx = Client, 5xx = Server."},en:{q:"Difference between 400 and 500?",opts:["No difference","400 = client error, 500 = server error","400 is worse","500 = partial success"],explanation:"4xx = Client, 5xx = Server."},correct:1},
  {ar:{q:"كيف تُرجع Status Code محدد؟",opts:["في application.properties","@ResponseStatus أو ResponseEntity","تعدّل Tomcat","لا يمكن"],explanation:"@ResponseStatus أو ResponseEntity.status()."},en:{q:"How to return a specific Status Code?",opts:["In application.properties","@ResponseStatus or ResponseEntity","Modify Tomcat","Not possible"],explanation:"@ResponseStatus or ResponseEntity.status()."},correct:1},
  {ar:{q:"ما معنى 409 Conflict؟",opts:["غير موجود","تعارض مع حالة المورد (تكرار unique)","خطأ شبكة","نجاح"],explanation:"409 = تكرار بيانات فريدة."},en:{q:"What does 409 Conflict mean?",opts:["Not found","Conflict with resource state (duplicate unique)","Network error","Success"],explanation:"409 = duplicate unique data."},correct:1},
  {ar:{q:"هل يُرسل stack trace في Production؟",opts:["نعم دائماً","أبداً — ثغرة أمنية","للمسجلين فقط","يعتمد"],explanation:"Stack trace = معلومات داخلية خطيرة."},en:{q:"Send stack trace in Production?",opts:["Always","Never — security vulnerability","For logged-in users","Depends"],explanation:"Stack trace = dangerous internal info."},correct:1},
  {ar:{q:"@ResponseStatus على Custom Exception؟",opts:["تمنع الخطأ","تُحدد HTTP Status Code الافتراضي","تُضيف logging","تُنشئ الخطأ"],explanation:"تحدد Status Code عند رمي الاستثناء."},en:{q:"@ResponseStatus on Custom Exception?",opts:["Prevents error","Sets default HTTP Status Code","Adds logging","Creates error"],explanation:"Sets Status Code when exception is thrown."},correct:1}
]};

const quiz6 = {questions:[
  {ar:{q:"ما الفرق بين Authentication و Authorization؟",opts:["لا فرق","Authentication = من أنت؟ Authorization = ماذا تملك؟","Auth للـ API فقط","Authorization = تسجيل دخول"],explanation:"Authentication = هوية. Authorization = صلاحيات."},en:{q:"Difference between Authentication and Authorization?",opts:["No difference","Authentication = who are you? Authorization = what can you do?","Auth for API only","Authorization = login"],explanation:"Authentication = identity. Authorization = permissions."},correct:1},
  {ar:{q:"ما وظيفة BCryptPasswordEncoder؟",opts:["تشفير اتصال","hashing آمن لكلمات المرور","ضغط بيانات","تشفير JSON"],explanation:"BCrypt = hash لا يمكن عكسه."},en:{q:"What does BCryptPasswordEncoder do?",opts:["Encrypts connection","Secure password hashing","Compresses data","Encrypts JSON"],explanation:"BCrypt = irreversible hash."},correct:1},
  {ar:{q:"ما هو SecurityFilterChain؟",opts:["سلسلة Controllers","سلسلة فلاتر تُعالج كل Request","قائمة مستخدمين","إعداد DB"],explanation:"كل request يمر عبر سلسلة فلاتر."},en:{q:"What is SecurityFilterChain?",opts:["Chain of Controllers","Chain of filters processing every Request","User list","DB config"],explanation:"Every request passes through filter chain."},correct:1},
  {ar:{q:"كيف تحمي endpoint محدد؟",opts:["@Secured على class","requestMatchers في SecurityFilterChain","تغيير port","كلمة مرور في properties"],explanation:"requestMatchers().hasRole() في SecurityFilterChain."},en:{q:"How to protect a specific endpoint?",opts:["@Secured on class","requestMatchers in SecurityFilterChain","Change port","Password in properties"],explanation:"requestMatchers().hasRole() in SecurityFilterChain."},correct:1},
  {ar:{q:"ما هو UserDetailsService؟",opts:["Service للـ UI","Interface يجلب بيانات المستخدم للتحقق","Controller","أداة تشفير"],explanation:"loadUserByUsername يبحث في DB."},en:{q:"What is UserDetailsService?",opts:["UI service","Interface to load user data for authentication","Controller","Encryption tool"],explanation:"loadUserByUsername searches the DB."},correct:1},
  {ar:{q:"ما الفرق بين hasRole و hasAuthority؟",opts:["لا فرق","hasRole يُضيف ROLE_ تلقائياً","hasRole للـ admin فقط","hasAuthority أسرع"],explanation:"hasRole('ADMIN') = hasAuthority('ROLE_ADMIN')."},en:{q:"Difference between hasRole and hasAuthority?",opts:["No difference","hasRole adds ROLE_ prefix automatically","hasRole for admin only","hasAuthority is faster"],explanation:"hasRole('ADMIN') = hasAuthority('ROLE_ADMIN')."},correct:1},
  {ar:{q:"ماذا عند الوصول لـ endpoint محمي بدون تسجيل؟",opts:["200 بدون بيانات","401 Unauthorized","يتوقف التطبيق","500"],explanation:"401 = لم تُثبت هويتك."},en:{q:"What happens accessing protected endpoint without login?",opts:["200 without data","401 Unauthorized","App crashes","500"],explanation:"401 = identity not verified."},correct:1},
  {ar:{q:"ما هو CORS؟",opts:["نوع هجوم","حماية المتصفح — Cross-Origin Resource Sharing","Plugin","إعداد DB"],explanation:"CORS = حماية المتصفح من requests لـ domain مختلف."},en:{q:"What is CORS?",opts:["An attack type","Browser protection — Cross-Origin Resource Sharing","A plugin","DB config"],explanation:"CORS = browser protection against cross-origin requests."},correct:1},
  {ar:{q:"ما وظيفة @PreAuthorize؟",opts:["تُشغّل method أولاً","تتحقق من الصلاحيات قبل تنفيذ method","تُحدد ترتيب filters","تُنشئ مستخدم"],explanation:"@PreAuthorize تمنع التنفيذ بدون صلاحية."},en:{q:"What does @PreAuthorize do?",opts:["Runs method first","Checks permissions before executing method","Sets filter order","Creates user"],explanation:"@PreAuthorize prevents execution without permission."},correct:1},
  {ar:{q:"ما الفرق بين 401 و 403؟",opts:["لا فرق","401 = لم تسجل، 403 = سجلت لكن بدون إذن","403 أخطر","401 للـ API فقط"],explanation:"401 = مجهول. 403 = معروف بدون إذن."},en:{q:"Difference between 401 and 403?",opts:["No difference","401 = not logged in, 403 = logged in but no permission","403 is worse","401 for API only"],explanation:"401 = unknown. 403 = known without permission."},correct:1}
]};

const quiz7 = {questions:[
  {ar:{q:"ما هو JWT؟",opts:["نوع DB","JSON Web Token — توكن مُوقّع stateless","Framework","أداة اختبار"],explanation:"JWT = توكن يحمل بيانات المستخدم."},en:{q:"What is JWT?",opts:["A DB type","JSON Web Token — signed stateless token","Framework","Testing tool"],explanation:"JWT = token carrying user data."},correct:1},
  {ar:{q:"ما أجزاء JWT الثلاثة؟",opts:["Username, Password, Role","Header, Payload, Signature","Key, Value, Hash","Request, Response, Token"],explanation:"JWT = Header.Payload.Signature"},en:{q:"What are the three parts of JWT?",opts:["Username, Password, Role","Header, Payload, Signature","Key, Value, Hash","Request, Response, Token"],explanation:"JWT = Header.Payload.Signature"},correct:1},
  {ar:{q:"ما معنى Stateless Authentication؟",opts:["السيرفر لا يحفظ جلسة — كل شيء في Token","بدون كلمة مرور","المستخدم لا يغادر","لا يوجد logout"],explanation:"Stateless = لا sessions. التوكن يحمل كل المعلومات."},en:{q:"What is Stateless Authentication?",opts:["Server stores no session — all info in Token","No password","User doesn't leave","No logout"],explanation:"Stateless = no sessions. Token carries all info."},correct:0},
  {ar:{q:"ما وظيفة OncePerRequestFilter؟",opts:["يُنفذ مرة عند التشغيل","فلتر يُنفذ مرة لكل Request — للتحقق من JWT","يمنع الطلبات المتكررة","يُسجل الطلبات"],explanation:"نرث OncePerRequestFilter لفحص JWT."},en:{q:"What does OncePerRequestFilter do?",opts:["Runs once on startup","Filter running once per Request — to verify JWT","Prevents duplicate requests","Logs requests"],explanation:"We extend OncePerRequestFilter to check JWT."},correct:1},
  {ar:{q:"أين يُرسل JWT عادةً؟",opts:["في URL","في Authorization Header: Bearer <token>","في Body","في Cookies فقط"],explanation:"Authorization: Bearer eyJhbG..."},en:{q:"Where is JWT usually sent?",opts:["In URL","In Authorization Header: Bearer <token>","In Body","In Cookies only"],explanation:"Authorization: Bearer eyJhbG..."},correct:1},
  {ar:{q:"ما هو Refresh Token؟",opts:["بديل Access Token","Token طويل العمر يُجدد Access Token","للاختبار فقط","نسخة مشفرة"],explanation:"Refresh Token يُجدد Access Token المنتهي."},en:{q:"What is a Refresh Token?",opts:["Access Token replacement","Long-lived token to renew Access Token","For testing only","Encrypted copy"],explanation:"Refresh Token renews expired Access Token."},correct:1},
  {ar:{q:"كيف نُبطل JWT؟",opts:["نحذفه من السيرفر","blacklist أو تقصير الصلاحية","نغيّر Secret","نحذف المستخدم"],explanation:"JWT stateless لا يُبطل مباشرة."},en:{q:"How to invalidate JWT?",opts:["Delete from server","Blacklist or shorten expiry","Change secret","Delete user"],explanation:"JWT is stateless, can't be directly invalidated."},correct:1},
  {ar:{q:"ما مكتبة Java الشائعة لـ JWT؟",opts:["Jackson","JJWT (io.jsonwebtoken)","Lombok","Spring Security Core"],explanation:"JJWT = الأشهر لـ JWT في Java."},en:{q:"Popular Java library for JWT?",opts:["Jackson","JJWT (io.jsonwebtoken)","Lombok","Spring Security Core"],explanation:"JJWT = most popular JWT library."},correct:1},
  {ar:{q:"ماذا يحدث عند انتهاء صلاحية JWT؟",opts:["يتجدد تلقائياً","401 Unauthorized — استخدم Refresh Token","لا شيء","يتحول لـ 403"],explanation:"JWT منتهي = 401."},en:{q:"What happens when JWT expires?",opts:["Auto-renews","401 Unauthorized — use Refresh Token","Nothing","Becomes 403"],explanation:"Expired JWT = 401."},correct:1},
  {ar:{q:"ما هو SecurityContextHolder؟",opts:["تخزين إعدادات","يحمل بيانات المستخدم المُصادق طوال Request","Controller أمان","DB مستخدمين"],explanation:"بعد التحقق من JWT، البيانات في SecurityContextHolder."},en:{q:"What is SecurityContextHolder?",opts:["Settings storage","Holds authenticated user data throughout Request","Security controller","User DB"],explanation:"After JWT verification, data goes to SecurityContextHolder."},correct:1}
]};

const quiz8 = {questions:[
  {ar:{q:"ما الفرق بين Unit و Integration Test؟",opts:["لا فرق","Unit = وحدة معزولة، Integration = عدة مكونات","Unit أبطأ","Integration للـ UI"],explanation:"Unit = method واحدة. Integration = تفاعل طبقات."},en:{q:"Difference between Unit and Integration Test?",opts:["No difference","Unit = isolated unit, Integration = multiple components","Unit is slower","Integration for UI"],explanation:"Unit = single method. Integration = layer interaction."},correct:1},
  {ar:{q:"ما وظيفة @Mock؟",opts:["كائن حقيقي","كائن وهمي يُحاكي السلوك","تحذف الكائن","نسخة DB"],explanation:"@Mock = نسخة وهمية. when().thenReturn()."},en:{q:"What does @Mock do?",opts:["Real object","Mock object simulating behavior","Deletes object","DB copy"],explanation:"@Mock = fake instance. when().thenReturn()."},correct:1},
  {ar:{q:"ما وظيفة @InjectMocks؟",opts:["تحقن beans في Spring","تحقن Mocks في الكائن المراد اختباره","تمنع الحقن","تُنشئ mock"],explanation:"@InjectMocks تُنشئ instance وتحقن mocks فيه."},en:{q:"What does @InjectMocks do?",opts:["Injects beans in Spring","Injects Mocks into the tested object","Prevents injection","Creates mock"],explanation:"@InjectMocks creates instance and injects mocks into it."},correct:1},
  {ar:{q:"ما هو MockMvc؟",opts:["متصفح وهمي","أداة اختبار Controller بدون سيرفر حقيقي","Mock لـ DB","أداة تغطية"],explanation:"MockMvc يُحاكي HTTP requests."},en:{q:"What is MockMvc?",opts:["Fake browser","Tests Controller without real server","DB mock","Coverage tool"],explanation:"MockMvc simulates HTTP requests."},correct:1},
  {ar:{q:"ما وظيفة @WebMvcTest؟",opts:["تُشغّل كل التطبيق","تُحمّل طبقة Web فقط — أسرع","تختبر DB","تُنشئ Mock"],explanation:"@WebMvcTest = Controller فقط."},en:{q:"What does @WebMvcTest do?",opts:["Loads entire app","Loads Web layer only — faster","Tests DB","Creates Mock"],explanation:"@WebMvcTest = Controller only."},correct:1},
  {ar:{q:"@SpringBootTest vs @WebMvcTest؟",opts:["لا فرق","@SpringBootTest = كل التطبيق، @WebMvcTest = ويب فقط","@WebMvcTest أبطأ","@SpringBootTest للـ Unit"],explanation:"@SpringBootTest = شامل. @WebMvcTest = سريع."},en:{q:"@SpringBootTest vs @WebMvcTest?",opts:["No difference","@SpringBootTest = full app, @WebMvcTest = web only","@WebMvcTest is slower","@SpringBootTest for Unit"],explanation:"@SpringBootTest = full. @WebMvcTest = fast."},correct:1},
  {ar:{q:"كيف نتحقق من Status Code في MockMvc؟",opts:["قراءة console","andExpect(status().isOk())","فحص logs","لا يمكن"],explanation:"MockMvc يوفر matchers."},en:{q:"How to check Status Code in MockMvc?",opts:["Read console","andExpect(status().isOk())","Check logs","Not possible"],explanation:"MockMvc provides matchers."},correct:1},
  {ar:{q:"when(service.findById(1L)).thenReturn(book)؟",opts:["ينشئ كتاب","عند استدعاء findById(1L) أرجع book","يحفظ في DB","يحذف"],explanation:"when().thenReturn() يبرمج سلوك Mock."},en:{q:"when(service.findById(1L)).thenReturn(book)?",opts:["Creates book","When findById(1L) is called, return book","Saves to DB","Deletes"],explanation:"when().thenReturn() programs Mock behavior."},correct:1},
  {ar:{q:"لماذا verify() في Mockito؟",opts:["للتحقق من response","للتأكد أن method تم استدعاؤه","لتشغيل الاختبار","لحساب تغطية"],explanation:"verify(service).findById(1L) يتأكد من الاستدعاء."},en:{q:"Why verify() in Mockito?",opts:["To check response","To confirm a method was called","To run test","To calculate coverage"],explanation:"verify(service).findById(1L) confirms the call."},correct:1},
  {ar:{q:"ما هي AAA Pattern؟",opts:["Auth/Authz/Audit","Arrange → Act → Assert","Add/Analyze/Apply","Async/Await/Abort"],explanation:"Arrange = جهّز. Act = نفّذ. Assert = تحقق."},en:{q:"What is the AAA Pattern?",opts:["Auth/Authz/Audit","Arrange → Act → Assert","Add/Analyze/Apply","Async/Await/Abort"],explanation:"Arrange = setup. Act = execute. Assert = verify."},correct:1}
]};

const quiz9 = {questions:[
  {ar:{q:"ما وظيفة Pageable؟",opts:["صفحات HTML","جلب بيانات مقسّمة بدلاً من الكل","ترتيب فقط","PDF"],explanation:"Pageable يقسم النتائج لصفحات."},en:{q:"What does Pageable do?",opts:["HTML pages","Fetch data in pages instead of all at once","Sorting only","PDF"],explanation:"Pageable splits results into pages."},correct:1},
  {ar:{q:"كيف نُضيف pagination لـ endpoint؟",opts:["SQL يدوي","Pageable كمعامل في Repository و Controller","Plugin","application.properties فقط"],explanation:"فقط أضف Pageable parameter."},en:{q:"How to add pagination to an endpoint?",opts:["Manual SQL","Pageable as parameter in Repository and Controller","Plugin","application.properties only"],explanation:"Just add Pageable parameter."},correct:1},
  {ar:{q:"ما وظيفة @Valid؟",opts:["تتحقق من URL","تُفعّل Bean Validation على الكائن","تُنشئ rules","تتحقق من token"],explanation:"@Valid تفحص القيود على حقول DTO."},en:{q:"What does @Valid do?",opts:["Validates URL","Activates Bean Validation on the object","Creates rules","Validates token"],explanation:"@Valid checks constraints on DTO fields."},correct:1},
  {ar:{q:"ما وظيفة @NotBlank؟",opts:["تمنع null فقط","تمنع null + فارغ + مسافات فقط","الحد الأقصى","تمنع أرقام"],explanation:"@NotBlank أشد من @NotNull و @NotEmpty."},en:{q:"What does @NotBlank do?",opts:["Prevents null only","Prevents null + empty + whitespace only","Maximum limit","Prevents numbers"],explanation:"@NotBlank is stricter than @NotNull and @NotEmpty."},correct:1},
  {ar:{q:"الفرق بين @NotNull و @NotEmpty و @NotBlank؟",opts:["لا فرق","@NotNull < @NotEmpty < @NotBlank صرامة","@NotBlank الأضعف","@NotNull للأرقام فقط"],explanation:"@NotNull < @NotEmpty < @NotBlank."},en:{q:"Difference: @NotNull vs @NotEmpty vs @NotBlank?",opts:["No difference","@NotNull < @NotEmpty < @NotBlank strictness","@NotBlank is weakest","@NotNull for numbers only"],explanation:"@NotNull < @NotEmpty < @NotBlank."},correct:1},
  {ar:{q:"رسائل خطأ واضحة عند فشل Validation؟",opts:["لا يمكن","message في القيد + التقاط MethodArgumentNotValidException","تعدّل Jackson","filter"],explanation:"message يُخصص الرسالة."},en:{q:"Clear error messages on Validation failure?",opts:["Not possible","message in constraint + catch MethodArgumentNotValidException","Modify Jackson","Filter"],explanation:"message customizes the error message."},correct:1},
  {ar:{q:"ما وظيفة @Min و @Max؟",opts:["طول نص","الحد الأدنى والأقصى لقيمة رقمية","عدد صفوف","تواريخ فقط"],explanation:"@Min(1) = 1 أو أكثر. @Max(100) = 100 أو أقل."},en:{q:"What do @Min and @Max do?",opts:["Text length","Min and max for numeric values","Row count","Dates only"],explanation:"@Min(1) = 1 or more. @Max(100) = 100 or less."},correct:1},
  {ar:{q:"كيف نُمرر رقم الصفحة في URL؟",opts:["في Body","Query Params: ?page=0&size=10&sort=title,asc","في Headers","في Path"],explanation:"Spring يقرأ page, size, sort تلقائياً."},en:{q:"How to pass page number in URL?",opts:["In Body","Query Params: ?page=0&size=10&sort=title,asc","In Headers","In Path"],explanation:"Spring reads page, size, sort automatically."},correct:1},
  {ar:{q:"ما هو Page<T>؟",opts:["قائمة عادية","كائن: البيانات + معلومات الصفحة","HTML page","PDF"],explanation:"Page<T>: content, totalPages, totalElements, number, size."},en:{q:"What is Page<T>?",opts:["A regular list","Object: data + page info","HTML page","PDF"],explanation:"Page<T>: content, totalPages, totalElements, number, size."},correct:1},
  {ar:{q:"ما وظيفة @Email؟",opts:["تُرسل email","تتحقق من صيغة email","تُنشئ حقل email","تُشفّر email"],explanation:"@Email تتحقق من نمط email."},en:{q:"What does @Email do?",opts:["Sends email","Validates email format","Creates email field","Encrypts email"],explanation:"@Email validates email pattern."},correct:1}
]};

const quiz10 = {questions:[
  {ar:{q:"ما هو Docker؟",opts:["بديل Java","أداة لتغليف التطبيق في حاوية تعمل في أي مكان","IDE","نظام تشغيل"],explanation:"Docker = حاوية تعمل في أي بيئة."},en:{q:"What is Docker?",opts:["Java replacement","Tool to package app in a container that runs anywhere","IDE","Operating system"],explanation:"Docker = container that runs in any environment."},correct:1},
  {ar:{q:"ما هو Dockerfile؟",opts:["ملف تشغيل","ملف تعليمات لبناء Docker Image","ملف إعدادات Spring","ملف Compose"],explanation:"Dockerfile = خطوات بناء Image."},en:{q:"What is a Dockerfile?",opts:["Runtime file","Instructions file to build Docker Image","Spring config file","Compose file"],explanation:"Dockerfile = steps to build Image."},correct:1},
  {ar:{q:"Docker Image vs Container؟",opts:["لا فرق","Image = قالب ثابت (class)، Container = نسخة عاملة (object)","Container أصغر","Image للاختبار"],explanation:"Image = template. Container = running instance."},en:{q:"Docker Image vs Container?",opts:["No difference","Image = static template (class), Container = running instance (object)","Container is smaller","Image for testing"],explanation:"Image = template. Container = running instance."},correct:1},
  {ar:{q:"ما وظيفة docker-compose؟",opts:["بديل Dockerfile","تشغيل عدة containers معاً بملف واحد","اختبار","مراقبة"],explanation:"docker-compose.yml: عدة services معاً."},en:{q:"What does docker-compose do?",opts:["Dockerfile replacement","Run multiple containers with one file","Testing","Monitoring"],explanation:"docker-compose.yml: multiple services together."},correct:1},
  {ar:{q:"كيف نُنشئ JAR file؟",opts:["من IntelliJ فقط","mvn clean package — ينتج JAR في target/","java -jar create","لا يمكن"],explanation:"mvn clean package يبني JAR."},en:{q:"How to create a JAR file?",opts:["IntelliJ only","mvn clean package — produces JAR in target/","java -jar create","Not possible"],explanation:"mvn clean package builds the JAR."},correct:1},
  {ar:{q:"ما هي Spring Profiles؟",opts:["حسابات مستخدمين","إعدادات مختلفة حسب البيئة: dev, prod","أنواع beans","مستويات أمان"],explanation:"Profile = إعداد حسب البيئة."},en:{q:"What are Spring Profiles?",opts:["User accounts","Different settings per environment: dev, prod","Bean types","Security levels"],explanation:"Profile = environment-specific config."},correct:1},
  {ar:{q:"كيف نُفعّل Profile؟",opts:["تعديل pom.xml","spring.profiles.active=prod أو environment variable","إعادة ترجمة","Dockerfile فقط"],explanation:"يمكن بـ properties أو env var أو CLI."},en:{q:"How to activate a Profile?",opts:["Edit pom.xml","spring.profiles.active=prod or environment variable","Recompile","Dockerfile only"],explanation:"Via properties, env var, or CLI."},correct:1},
  {ar:{q:"أول أمر Docker لبناء image؟",opts:["docker start","docker build -t myapp .","docker create","docker init"],explanation:"docker build -t name . يقرأ Dockerfile."},en:{q:"First Docker command to build image?",opts:["docker start","docker build -t myapp .","docker create","docker init"],explanation:"docker build -t name . reads Dockerfile."},correct:1},
  {ar:{q:"ما وظيفة EXPOSE في Dockerfile؟",opts:["تفتح port تلقائياً","توثّق port (لا تفتحه — تحتاج -p)","تمنع الوصول","تُحدد protocol"],explanation:"EXPOSE = توثيقية فقط."},en:{q:"What does EXPOSE do in Dockerfile?",opts:["Opens port automatically","Documents port (doesn't open it — need -p)","Blocks access","Sets protocol"],explanation:"EXPOSE = documentation only."},correct:1},
  {ar:{q:"أشهر منصات Cloud لـ Spring Boot؟",opts:["WordPress فقط","AWS, GCP, Azure, Railway, Heroku","GitHub فقط","Vercel فقط"],explanation:"Spring Boot JAR على أي cloud."},en:{q:"Popular Cloud platforms for Spring Boot?",opts:["WordPress only","AWS, GCP, Azure, Railway, Heroku","GitHub only","Vercel only"],explanation:"Spring Boot JAR runs on any cloud."},correct:1}
]};

// ===== SESSION 1 =====
window.getSession1HTML = function(s) {
return hero(s,"01") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(255,215,0,0.1);">🤔</span> ${L("ما هو Spring Boot؟ ولماذا نستخدمه؟","What is Spring Boot? And why use it?")}</h3>
    <div class="explain-box"><p>${L("قبل Spring Boot، بناء تطبيق Java للـ backend كان <strong>مُعقّدًا جداً</strong>. كنت تحتاج لإعداد خادم Tomcat يدويًا، كتابة عشرات ملفات XML، إدارة الـ dependencies بنفسك، أسابيع قبل كتابة سطر كود!","Before Spring Boot, building a Java backend was <strong>very complex</strong>. You had to setup Tomcat manually, write dozens of XML files, manage dependencies yourself... weeks before writing code!")}</p>
      <div class="analogy">${L("المثال: بدون Spring Boot = تبني مبنى من الصفر. مع Spring Boot = تستأجر مطبخًا جاهزًا وتبدأ الطهي!","Analogy: Without Spring Boot = building a kitchen from scratch. With Spring Boot = renting a fully equipped kitchen and starting cooking!")}</div>
      <p style="margin-top:10px">${L("يُضيف Spring Boot طبقة فوق Spring Framework:","Spring Boot adds a layer on top of Spring Framework:")}</p>
      <div class="highlight">
        ✅ Auto-Configuration: ${L("يُعِدّ Spring تلقائيًا","Configures Spring automatically")}<br>
        ✅ Embedded Tomcat: ${L("لا تحتاج تثبيته","No need to install it")}<br>
        ✅ Starter Dependencies: ${L("حزم جاهزة","Ready-made bundles")}<br>
        ✅ Production-ready: ${L("health checks, metrics, logging","health checks, metrics, logging")}
      </div></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">⚙️</span> ${L("خطوات الإعداد","Setup Steps")}</h3>
    <div class="steps">
      <div class="step-item"><div class="step-num">1</div><div class="step-content"><h4>${L("تثبيت JDK 17 أو 21","Install JDK 17 or 21")}</h4>
        <p>${L("الـ JDK (Java Development Kit) هو المحرك الذي يشغل كود Java. Spring Boot 3.x يتطلب Java 17 كحد أدنى.","The JDK (Java Development Kit) is the engine that runs Java code. Spring Boot 3.x requires Java 17 minimum.")}</p></div></div>
      <div class="step-item"><div class="step-num">2</div><div class="step-content"><h4>${L("إنشاء المشروع عبر Spring Initializr","Create project via Spring Initializr")}</h4>
        <p>${L("اذهب إلى <code>start.spring.io</code> واختر: Maven, Java, Spring Boot 3.x. في قسم Dependencies أضف <strong>Spring Web</strong>.","Go to <code>start.spring.io</code> and select: Maven, Java, Spring Boot 3.x. In Dependencies add <strong>Spring Web</strong>.")}</p></div></div>
      <div class="step-item"><div class="step-num">3</div><div class="step-content"><h4>${L("افتح المشروع في IntelliJ IDEA","Open project in IntelliJ IDEA")}</h4>
        <p>${L("قم بفك الضغط عن الملف المحمل، وافتحه باستخدام IntelliJ IDEA (النسخة المجانية Community تكفي).","Unzip the downloaded file, open it with IntelliJ IDEA (Community edition is enough).")}</p></div></div>
    </div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">📝</span> ${L("أول Endpoint لك (Hello World)","Your First Endpoint")}</h3>
    <div class="explain-box"><p>${L("الـ <strong>Endpoint</strong> هو رابط URL يمكن للمستخدم أو التطبيق (مثل تطبيق موبايل) الاتصال به لطلب بيانات أو إرسالها.","An <strong>Endpoint</strong> is a URL that a client (like a mobile app) can connect to to request or send data.")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">HelloController.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre>package com.example.demo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

<span class="ann">@RestController</span>
<span class="kw">public class</span> <span class="cls">HelloController</span> {

    <span class="ann">@GetMapping</span>(<span class="str">"/hello"</span>)
    <span class="kw">public</span> <span class="type">String</span> <span class="fn">sayHello</span>() {
        <span class="kw">return</span> <span class="str">"Hello, Spring Boot!"</span>;
    }
}</pre></div>
    <div class="ann-card"><div class="ann-badge">@RestController</div><div class="ann-info"><h4>${L("ماذا تفعل هذه الكلمة؟","What does this word do?")}</h4>
      <p>${L("تُخبر Spring أن هذا الـ Class يحتوي على روابط API، وسيتم إرجاع البيانات مباشرة (كـ JSON أو Text) وليس كصفحة HTML.","Tells Spring this class contains API endpoints, and returns data directly (JSON/Text) not as an HTML page.")}</p></div></div>
    <div class="ann-card"><div class="ann-badge">@GetMapping</div><div class="ann-info"><h4>${L("استقبال نوع GET","Handle GET request")}</h4>
      <p>${L("تُحدد أن الـ Method هذه سيتم استدعاؤها عندما يزور المستخدم الرابط <code>/hello</code> باستخدام متصفحه (وهو دائمًا نوع GET).","Specifies this method is called when visiting <code>/hello</code> via browser (which is always a GET request).")}</p></div></div>
  </div>
  ${quizBlock(1, "اختبار الجلسة الأولى — 10 أسئلة", "Session 1 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 2 =====
window.getSession2HTML = function(s) {
return hero(s,"02") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">🏗️</span> ${L("ما هو الـ REST API؟","What is a REST API?")}</h3>
    <div class="explain-box"><p>${L("REST = أسلوب معماري. كل شيء Resource يُوصل عبر URL باستخدام HTTP Methods.","REST = architectural style. Everything is a Resource accessed via URL using HTTP Methods.")}</p>
      <div class="analogy">${L("المثال: API = منيو مطعم. الـ URL = اسم الطبق. HTTP Method = الأكشن (طلب، تعديل، إلغاء).","Analogy: API = restaurant menu. URL = dish name. HTTP Method = action (order, modify, cancel).")}</div></div>
    <table class="data-table"><tr><th>${L("الوظيفة","Action")}</th><th>Method</th><th>${L("مثال","Example")}</th></tr>
      <tr><td>${L("قراءة (Read)","Read")}</td><td style="color:var(--green)">GET</td><td>api/books/</td></tr>
      <tr><td>${L("إنشاء (Create)","Create")}</td><td style="color:var(--accent)">POST</td><td>api/books/</td></tr>
      <tr><td>${L("تعديل كامل (Update)","Full Update")}</td><td style="color:var(--yellow)">PUT</td><td>api/books/1/</td></tr>
      <tr><td>${L("حذف (Delete)","Delete")}</td><td style="color:var(--red)">DELETE</td><td>api/books/1/</td></tr></table>
  </div>
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">📦</span> ${L("نموذج البيانات (Model)","Data Model")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">model/Book.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre>package com.example.demo.model;

<span class="kw">public class</span> <span class="cls">Book</span> {
    <span class="kw">private</span> <span class="type">Long</span> id;
    <span class="kw">private</span> <span class="type">String</span> title;
    <span class="kw">private</span> <span class="type">String</span> author;
    
    <span class="cmt">// Constructors, Getters, Setters...</span>
    <span class="kw">public</span> <span class="cls">Book</span>(<span class="type">Long</span> id, <span class="type">String</span> title, <span class="type">String</span> author) {
        <span class="kw">this</span>.id = id;
        <span class="kw">this</span>.title = title;
        <span class="kw">this</span>.author = author;
    }
}</pre></div>
  </div>
  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🧠</span> ${L("Controller كامل للـ CRUD","Full CRUD Controller")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">controller/BookController.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@RestController</span>
<span class="ann">@RequestMapping</span>(<span class="str">"/api/books"</span>) <span class="cmt">// ← المسار الأساسي لكل الـ endpoints هنا</span>
<span class="kw">public class</span> <span class="cls">BookController</span> {

    <span class="kw">private</span> <span class="cls">List</span>&lt;<span class="cls">Book</span>&gt; books = <span class="kw">new</span> <span class="cls">ArrayList</span>&lt;&gt;();

    <span class="cmt">// GET /api/books</span>
    <span class="ann">@GetMapping</span>
    <span class="kw">public</span> <span class="cls">List</span>&lt;<span class="cls">Book</span>&gt; <span class="fn">getAllBooks</span>() {
        <span class="kw">return</span> books; <span class="cmt">// ← Jackson يحول الـ List إلى JSON Array تلقائياً!</span>
    }

    <span class="cmt">// GET /api/books/{id}</span>
    <span class="ann">@GetMapping</span>(<span class="str">"/{id}"</span>)
    <span class="kw">public</span> <span class="cls">Book</span> <span class="fn">getBookById</span>(<span class="ann">@PathVariable</span> <span class="type">Long</span> id) {
        <span class="kw">return</span> books.stream()
                .filter(b -> b.getId().equals(id))
                .findFirst()
                .orElse(<span class="kw">null</span>);
    }

    <span class="cmt">// POST /api/books</span>
    <span class="ann">@PostMapping</span>
    <span class="kw">public</span> <span class="cls">Book</span> <span class="fn">createBook</span>(<span class="ann">@RequestBody</span> <span class="cls">Book</span> book) {
        books.add(book);
        <span class="kw">return</span> book;
    }
}</pre></div>
    <div class="ann-card"><div class="ann-badge">@RequestMapping</div><div class="ann-info"><h4>${L("Base URL","Base URL")}</h4><p>${L("تُحدد مسارًا أساسيًا (مثل /api/books) يُطبّق على كل الـ Methods في هذا الـ Class.","Sets a base path applied to all methods in the class.")}</p></div></div>
    <div class="ann-card"><div class="ann-badge">@PathVariable</div><div class="ann-info"><h4>${L("متغير داخل المسار","Path Variable")}</h4><p>${L("استخراج جزء ديناميكي من الـ URL (مثل ايدي الكتاب) وتمريره كـ Parameter للـ Method.","Extract dynamic part from URL (like book ID) and pass as method parameter.")}</p></div></div>
    <div class="ann-card"><div class="ann-badge">@RequestBody</div><div class="ann-info"><h4>${L("جسم الطلب","Request Body")}</h4><p>${L("تحويل الـ JSON المُرسل في جسم الطلب (Body) إلى كائن Java (Object) تلقائيًا.","Convert JSON sent in request body to Java object automatically.")}</p></div></div>
  </div>
  ${quizBlock(2, "اختبار الجلسة الثانية — 10 أسئلة", "Session 2 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 3 =====
window.getSession3HTML = function(s) {
return hero(s,"03") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">💾</span> ${L("كيف يتعامل Spring مع قاعدة البيانات؟","How Spring handles databases?")}</h3>
    <div class="explain-box"><p>${L("Spring يستخدم <strong>Spring Data JPA</strong>. وهي طبقة ذكية تجعلك تتحدث مع قاعدة البيانات بـ Java دون كتابة أكواد SQL معقدة!","Spring uses <strong>Spring Data JPA</strong>. A smart layer letting you talk to DB in Java without complex SQL.")}</p>
      <div class="info-grid">
        <div class="info-card"><div class="ic-label">JPA</div><div class="ic-value">${L("مواصفات قياسية لتحويل كائنات Java إلى جداول DB.","Standard spec maps Java objects to DB tables.")}</div></div>
        <div class="info-card"><div class="ic-label">Hibernate</div><div class="ic-value">${L("المكتبة الفعلية التي تُنفذ JPA خلف الكواليس.","Real library implementing JPA under the hood.")}</div></div>
      </div></div>
    <div class="tip-box"><div class="tip-label">💡 ${L("معلومة هامة","Important Note")}</div><p>${L("سنستخدم قاعدة بيانات <strong>H2 In-Memory</strong> من أجل التطوير، لا تحتاج لأي تسطيب، تعمل في الذاكرة وتختفي عند إغلاق التطبيق.","We'll use <strong>H2 In-Memory</strong> database for development. No install needed, runs in RAM, resets on restart.")}</p></div>
  </div>
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">🗺️</span> ${L("تحويل Class إلى جدول (Entity)","Mapping Class to Table")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">model/Book.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre>package com.example.demo.model;
import jakarta.persistence.*;

<span class="ann">@Entity</span> <span class="cmt">// ← تُخبر JPA أن هذا الكلاس سيكون جدولًا في قاعدة البيانات</span>
<span class="ann">@Table</span>(name = <span class="str">"books"</span>) <span class="cmt">// اختياري لتغيير اسم الجدول</span>
<span class="kw">public class</span> <span class="cls">Book</span> {

    <span class="ann">@Id</span> <span class="cmt">// ← هذا هو الـ Primary Key</span>
    <span class="ann">@GeneratedValue</span>(strategy = <span class="cls">GenerationType</span>.IDENTITY) <span class="cmt">// ← Auto-Increment</span>
    <span class="kw">private</span> <span class="type">Long</span> id;

    <span class="ann">@Column</span>(nullable = <span class="kw">false</span>) <span class="cmt">// ← حقل إجباري (Not Null)</span>
    <span class="kw">private</span> <span class="type">String</span> title;

    <span class="kw">private</span> <span class="type">String</span> author; <span class="cmt">// ← سيصبح عمودًا عاديًا</span>

    <span class="cmt">// Constructors, Getters, Setters لا تنساها!</span>
    <span class="kw">public</span> <span class="cls">Book</span>() {} <span class="cmt">// ← JPA يتطلب constructor فارغ</span>
}</pre></div>
  </div>
  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🪄</span> ${L("السحر الحقيقي: JpaRepository","Real Magic: JpaRepository")}</h3>
    <div class="explain-box"><p>${L("بدلًا من كتابة استعلامات SQL مثل <code>SELECT * FROM books</code>، ستقوم فقط بوراثة Interface جاهز وسيقوم Spring بتوليد كل الأكواد نيابة عنك!","Instead of writing SQL, extend a ready Interface and Spring generates all queries!")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">repository/BookRepository.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre>package com.example.demo.repository;
import org.springframework.data.jpa.repository.JpaRepository;

<span class="cmt">// <اسم الـ Entity , نوع الـ Primary Key></span>
<span class="kw">public interface</span> <span class="cls">BookRepository</span> <span class="kw">extends</span> <span class="cls">JpaRepository</span>&lt;<span class="cls">Book</span>, <span class="type">Long</span>&gt; {
    <span class="cmt">// ألف مبروك! لديك الآن methods جاهزة:</span>
    <span class="cmt">// save(), findAll(), findById(), deleteById() ... وغيرها الكثير!</span>
    
    <span class="cmt">// يمكنك استنتاج الـ methods من الاسم! Spring سيكتب الـ SQL لك.</span>
    <span class="cls">List</span>&lt;<span class="cls">Book</span>&gt; <span class="fn">findByAuthor</span>(<span class="type">String</span> author);
}</pre></div>
  </div>
  ${quizBlock(3, "اختبار الجلسة الثالثة — 10 أسئلة", "Session 3 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 4 =====
window.getSession4HTML = function(s) {
return hero(s,"04") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">🏢</span> ${L("Layered Architecture (الهيكلة الطبقية)","Layered Architecture")}</h3>
    <div class="explain-box"><p>${L("الـ Controller لا يجب أن يتحدث مع الـ Database مباشرة! الكود الاحترافي يُقسّم لـ 3 طبقات:","Controller shouldn't talk to DB directly! Professional code is split into 3 layers:")}</p>
      <div class="info-grid">
        <div class="info-card"><div class="ic-label">1. Controller Layer</div><div class="ic-value">${L("يستقبل الطلبات (HTTP) ويُرجع الردود. لا يحتوي على منطق (Logic).","Receives HTTP reqs, returns responses. No business logic.")}</div></div>
        <div class="info-card"><div class="ic-label">2. Service Layer</div><div class="ic-value">${L("يحتوي على <strong>Business Logic</strong> (الحسابات، القواعد...).","Contains <strong>Business Logic</strong> (calculations, rules...).")}</div></div>
        <div class="info-card" style="grid-column:1/-1"><div class="ic-label">3. Repository Layer</div><div class="ic-value">${L("مسؤول عن التحدث مع Database (حفظ وجلب البيانات).","Responsible for talking to DB (save/fetch data).")}</div></div>
      </div>
      <div class="analogy">🍔 ${L("الـ Controller هو النادل (يأخذ الطلب). الـ Service هو الطباخ (يُحضر الوجبة). الـ Repository هو الثلاجة (يجلب المكونات).","Controller is waiter. Service is Chef. Repository is Fridge.")}</div></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">👷‍♂️</span> ${L("الـ Service Layer و Dependency Injection","Service Layer & Dependency Injection")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">service/BookService.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Service</span> <span class="cmt">// ← تُعرّف أن هذا الكلاس هو Service ليقوم Spring بإنشائه (Bean)</span>
<span class="kw">public class</span> <span class="cls">BookService</span> {
    <span class="kw">private final</span> <span class="cls">BookRepository</span> repo;

    <span class="cmt">// Dependency Injection (Constructor Injection) — الطريقة الأفضل والأكثر أماناً</span>
    <span class="kw">public</span> <span class="cls">BookService</span>(<span class="cls">BookRepository</span> repo) {
        <span class="kw">this</span>.repo = repo;
    }

    <span class="kw">public</span> <span class="cls">List</span>&lt;<span class="cls">Book</span>&gt; <span class="fn">getAllBooks</span>() {
        <span class="kw">return</span> repo.findAll();
    }
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🛡️</span> ${L("ما هو الـ DTO؟ (Data Transfer Object)","What is DTO?")}</h3>
    <div class="explain-box"><p>${L("لا تُرسل كائنات الـ Entity للعميل مباشرة! قد تحتوي على حقول حساسة كالرقم السري أو بيانات تقنية لا تهمه. الـ <strong>DTO</strong> هو كائن بُني <em>خصيصاً</em> لنقل البيانات.","Don't send Entities to clients directly! Might expose passwords or internal data. <strong>DTO</strong> is a custom object built <em>specifically</em> for data transfer.")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">dto/BookDTO.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="cmt">// Record ميزة في Java 14+ تصنع كلاس لجمع البيانات بسرعة (يولد getters/constructors تلقائياً)</span>
<span class="kw">public record</span> <span class="cls">BookDTO</span>(<span class="type">Long</span> id, <span class="type">String</span> title) {}</pre></div>
    
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">تعديل الـ Controller لاستخدام الـ Service والـ DTO</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@RestController</span>
<span class="ann">@RequestMapping</span>(<span class="str">"/api/books"</span>)
<span class="kw">public class</span> <span class="cls">BookController</span> {
    <span class="kw">private final</span> <span class="cls">BookService</span> service; <span class="cmt">// حقن الـ Service فقط</span>

    <span class="kw">public</span> <span class="cls">BookController</span>(<span class="cls">BookService</span> service) {
        <span class="kw">this</span>.service = service;
    }

    <span class="ann">@GetMapping</span>
    <span class="kw">public</span> <span class="cls">List</span>&lt;<span class="cls">BookDTO</span>&gt; <span class="fn">getAll</span>() {
        <span class="cmt">// نحصل على الـ Entities من الـ Service، ثم نحولها لـ DTOs للعميل!</span>
        <span class="kw">return</span> service.getAllBooks().stream()
                .map(b -> <span class="kw">new</span> <span class="cls">BookDTO</span>(b.getId(), b.getTitle()))
                .toList();
    }
}</pre></div>
  </div>
  ${quizBlock(4, "اختبار الجلسة الرابعة — 10 أسئلة", "Session 4 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 5 =====
window.getSession5HTML = function(s) {
return hero(s,"05") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(239,68,68,0.1);">⚠️</span> ${L("معالجة الأخطاء الاحترافية","Professional Error Handling")}</h3>
    <div class="explain-box"><p>${L("عندما يطلب المستخدم مستنداً غير موجود، السيرفر لا يجب أن ينفجر ويُرسل Stack Trace! يجب الرد بـ Status Code صحيح ورسالة JSON واضحة.","When a user asks for a non-existent document, the server shouldn't explode and send a Stack Trace! Respond with correct Status Code and clear JSON.")}</p></div>
    
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">1. إنشاء استثناء مخصص (Custom Exception)</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre>package com.example.demo.exception;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

<span class="cmt">// عند رمي هذا الخطأ، سيحول Spring الـ Status إلى 404 بدلاً من 500</span>
<span class="ann">@ResponseStatus</span>(<span class="cls">HttpStatus</span>.NOT_FOUND)
<span class="kw">public class</span> <span class="cls">ResourceNotFoundException</span> <span class="kw">extends</span> <span class="cls">RuntimeException</span> {
    <span class="kw">public</span> <span class="cls">ResourceNotFoundException</span>(<span class="type">String</span> message) {
        <span class="kw">super</span>(message);
    }
}</pre></div>

    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">2. رمي الاستثناء في الـ Service Layer</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">public</span> <span class="cls">Book</span> <span class="fn">getBookById</span>(<span class="type">Long</span> id) {
    <span class="kw">return</span> repo.findById(id)
            .orElseThrow(() -> <span class="kw">new</span> <span class="cls">ResourceNotFoundException</span>(<span class="str">"كتاب غير موجود!"</span>));
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(16,185,129,0.1);">🌐</span> ${L("المعالج العالمي (Global Exception Handler)","Global Exception Handler")}</h3>
    <div class="explain-box"><p>${L("بدل استخدام try-catch في كل controller، نستخدم <strong>@ControllerAdvice</strong> لالتقاط كل الأخطاء من مكان واحد مركزي.","Instead of try-catch in every controller, use <strong>@ControllerAdvice</strong> to catch all errors centrally.")}</p></div>
    
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">exception/GlobalExceptionHandler.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@ControllerAdvice</span> <span class="cmt">// ← تراقب كل الـ Controllers لالتقاط الأخطاء</span>
<span class="kw">public class</span> <span class="cls">GlobalExceptionHandler</span> {

    <span class="ann">@ExceptionHandler</span>(<span class="cls">ResourceNotFoundException</span>.<span class="kw">class</span>)
    <span class="kw">public</span> <span class="cls">ResponseEntity</span>&lt;<span class="cls">Map</span>&lt;<span class="type">String</span>, <span class="type">String</span>&gt;&gt; <span class="fn">handleNotFound</span>(<span class="cls">ResourceNotFoundException</span> ex) {
        <span class="cls">Map</span>&lt;<span class="type">String</span>, <span class="type">String</span>&gt; errorResponse = <span class="kw">new</span> <span class="cls">HashMap</span>&lt;&gt;();
        errorResponse.put(<span class="str">"error"</span>, <span class="str">"Not Found"</span>);
        errorResponse.put(<span class="str">"message"</span>, ex.getMessage());
        
        <span class="kw">return</span> <span class="kw">new</span> <span class="cls">ResponseEntity</span>&lt;&gt;(errorResponse, <span class="cls">HttpStatus</span>.NOT_FOUND);
    }
    
    <span class="cmt">// النتيجة JSON:</span>
    <span class="cmt">// { "error": "Not Found", "message": "كتاب غير موجود!" }</span>
}</pre></div>
  </div>
  ${quizBlock(5, "اختبار الجلسة الخامسة — 10 أسئلة", "Session 5 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 6 =====
window.getSession6HTML = function(s) {
return hero(s,"06") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">🔒</span> ${L("Authentication vs Authorization","Authentication vs Authorization")}</h3>
    <div class="explain-box"><p>${L("أهم مفهومين في عالم الأمان:","The two most important concepts in security:")}</p>
      <div class="info-grid">
        <div class="info-card"><div class="ic-label">Authentication (المصادقة)</div><div class="ic-value">${L("<strong>من أنت؟</strong> (التحقق من الهوية عبر الإيميل والباسورد).","<strong>Who are you?</strong> (Identity verification via email/password).")}</div></div>
        <div class="info-card"><div class="ic-label">Authorization (الصلاحيات)</div><div class="ic-value">${L("<strong>ماذا يحق لك أن تفعل؟</strong> (هل أنت Admin أم User عادي؟).","<strong>What are you allowed to do?</strong> (Are you Admin or normal User?).")}</div></div>
      </div>
      <div class="analogy">${L("المثال: جندي الأمن على الباب يتأكد من هويتك (Authentication)، لكن بطاقتك تحدد هل يُسمح لك بدخول غرفة السيرفرات أم لا (Authorization).","Analogy: Security guard at door checks ID (Authentication), but your badge determines if you can enter the server room (Authorization).")}</div></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">🧱</span> ${L("كيف يعمل Spring Security؟ (Filter Chain)","How Spring Security Works? (Filter Chain)")}</h3>
    <div class="explain-box"><p>${L("أي <code>Request</code> يدخل للتطبيق لا يصل للـ Controller مباشرة. يمر أولاً عبر سلسلة من الحراس (Filters). كل حارس له وظيفة.","Any HTTP Request doesn't reach Controller directly. It passes through a chain of guards (Filters).")}!</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">SecurityConfig.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Configuration</span>
<span class="ann">@EnableWebSecurity</span>
<span class="kw">public class</span> <span class="cls">SecurityConfig</span> {

    <span class="ann">@Bean</span>
    <span class="kw">public</span> <span class="cls">SecurityFilterChain</span> <span class="fn">securityFilterChain</span>(<span class="cls">HttpSecurity</span> http) <span class="kw">throws</span> <span class="cls">Exception</span> {
        http
            .csrf(csrf -> csrf.disable()) <span class="cmt">// ← نغلقه في الـ REST APIs (لأننا سنستخدم توكن)</span>
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(<span class="str">"/api/public/**"</span>).permitAll() <span class="cmt">// ← مسموح للجميع</span>
                .requestMatchers(<span class="str">"/api/admin/**"</span>).hasRole(<span class="str">"ADMIN"</span>) <span class="cmt">// ← للـ Admin فقط</span>
                .anyRequest().authenticated() <span class="cmt">// ← أي مسار آخر يتطلب تسجيل دخول</span>
            );
        <span class="kw">return</span> http.build();
    }

    <span class="cmt">// أداة تشفير كلمات المرور (لا تحفظ الباسورد كنص عادي أبداً!)</span>
    <span class="ann">@Bean</span>
    <span class="kw">public</span> <span class="cls">PasswordEncoder</span> <span class="fn">passwordEncoder</span>() {
        <span class="kw">return new</span> <span class="cls">BCryptPasswordEncoder</span>();
    }
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">👤</span> ${L("UserDetailsService","UserDetailsService")}</h3>
    <div class="explain-box"><p>${L("كيف يعرف Spring بيانات المستخدمين من الداتابيز؟ من خلال توفير كلاس يُطبق Interface يُدعى <code>UserDetailsService</code>.","How does Spring know users from DB? By providing a class implementing <code>UserDetailsService</code>.")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">CustomUserDetailsService.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Service</span>
<span class="kw">public class</span> <span class="cls">CustomUserDetailsService</span> <span class="kw">implements</span> <span class="cls">UserDetailsService</span> {
    <span class="kw">private final</span> <span class="cls">UserRepository</span> repo;
    
    <span class="kw">public</span> <span class="cls">CustomUserDetailsService</span>(<span class="cls">UserRepository</span> repo) { <span class="kw">this</span>.repo = repo; }

    <span class="ann">@Override</span>
    <span class="kw">public</span> <span class="cls">UserDetails</span> <span class="fn">loadUserByUsername</span>(<span class="type">String</span> email) <span class="kw">throws</span> <span class="cls">UsernameNotFoundException</span> {
        <span class="cls">User</span> user = repo.findByEmail(email)
                .orElseThrow(() -> <span class="kw">new</span> <span class="cls">UsernameNotFoundException</span>(<span class="str">"User not found"</span>));
                
        <span class="cmt">// نحول الـ Entity الخاص بنا إلى UserDetails يفهمه Spring Security</span>
        <span class="kw">return</span> org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole()) <span class="cmt">// مثل "USER" أو "ADMIN"</span>
                .build();
    }
}</pre></div>
  </div>
  ${quizBlock(6, "اختبار الجلسة السادسة — 10 أسئلة", "Session 6 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 7 =====
window.getSession7HTML = function(s) {
return hero(s,"07") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">🔑</span> ${L("ما هو JSON Web Token (JWT)؟","What is JSON Web Token (JWT)?")}</h3>
    <div class="explain-box"><p>${L("في تطبيقات الـ Web القديمة، السيرفر يحفظ (جلسة/Session) لكل مستخدم. في الـ REST API الحديثة نستخدم <strong>Stateless Authentication</strong>: السيرفر لا يتذكر أحداً!","In old web apps, server stores Session for each user. In modern REST API we use <strong>Stateless Authentication</strong>: Server remembers no one!")}</p>
      <div class="analogy">${L("JWT = تذكرة سفر مُختومة. السيرفر يقرأ التذكرة، يتأكد من الختم، ويعرف من أنت دون أن يبحث في قاعدة البيانات!","JWT = Stamped ticket. Server reads ticket, verifies stamp, knows who you are without DB query!")}</div>
      <div class="highlight"><strong>${L("أجزاء التوكن: Header . Payload . Signature","Token parts: Header . Payload . Signature")}</strong><br>${L("الـ Payload يحتوي على بيانات المستخدم (الايميل). الـ Signature يمنع تزوير التوكن.","Payload has user data (email). Signature prevents forgery.")}</div></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">⚙️</span> ${L("محرك الـ JWT (إنشاء وتحقق)","JWT Engine (Generate & Verify)")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">JwtService.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Service</span>
<span class="kw">public class</span> <span class="cls">JwtService</span> {
    <span class="kw">private final</span> <span class="type">String</span> SECRET = <span class="str">"MySuperSecretKeyForJwtWhichMustBeLongEnough!!"</span>;

    <span class="cmt">// إنشاء التوكن</span>
    <span class="kw">public</span> <span class="type">String</span> <span class="fn">generateToken</span>(<span class="type">String</span> username) {
        <span class="kw">return</span> <span class="cls">Jwts</span>.builder()
                .setSubject(username)
                .setIssuedAt(<span class="kw">new</span> <span class="cls">Date</span>())
                .setExpiration(<span class="kw">new</span> <span class="cls">Date</span>(<span class="cls">System</span>.currentTimeMillis() + <span class="num">1000</span> * <span class="num">60</span> * <span class="num">60</span>)) <span class="cmt">// ساعة واحدة</span>
                .signWith(<span class="cls">SignatureAlgorithm</span>.HS256, SECRET)
                .compact();
    }

    <span class="cmt">// استخراج الايميل (ونتحقق من صحته التلقائية)</span>
    <span class="kw">public</span> <span class="type">String</span> <span class="fn">extractUsername</span>(<span class="type">String</span> token) {
        <span class="kw">return</span> <span class="cls">Jwts</span>.parser().setSigningKey(SECRET)
                .parseClaimsJws(token).getBody().getSubject();
    }
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🛡️</span> ${L("فلتر التحقق (JWT Filter)","JWT Filter")}</h3>
    <div class="explain-box"><p>${L("هذا الفلتر يعترض كل طلب، يبحث عن التوكن في الـ Header، وإذا كان صحيحاً يُخبر Spring ببيانات المستخدم للسماح له بالمرور.","Intercepts every request, looks for Token in Header, if valid tells Spring user data to allow pass.")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">JwtFilter.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Component</span>
<span class="kw">public class</span> <span class="cls">JwtFilter</span> <span class="kw">extends</span> <span class="cls">OncePerRequestFilter</span> {
    <span class="kw">private final</span> <span class="cls">JwtService</span> jwtService;

    <span class="ann">@Override</span>
    <span class="kw">protected void</span> <span class="fn">doFilterInternal</span>(<span class="cls">HttpServletRequest</span> request, <span class="cls">HttpServletResponse</span> response, <span class="cls">FilterChain</span> chain) {
        <span class="type">String</span> header = request.getHeader(<span class="str">"Authorization"</span>);
        
        <span class="kw">if</span> (header != <span class="kw">null</span> && header.startsWith(<span class="str">"Bearer "</span>)) {
            <span class="type">String</span> token = header.substring(<span class="num">7</span>);
            <span class="type">String</span> username = jwtService.extractUsername(token);
            
            <span class="kw">if</span> (username != <span class="kw">null</span> && <span class="cls">SecurityContextHolder</span>.getContext().getAuthentication() == <span class="kw">null</span>) {
                <span class="cmt">// نُخبر Spring بهوية المستخدم حتى يمر للـ Controller</span>
                <span class="cls">UsernamePasswordAuthenticationToken</span> auth = <span class="kw">new</span> <span class="cls">UsernamePasswordAuthenticationToken</span>(
                        username, <span class="kw">null</span>, <span class="kw">new</span> <span class="cls">ArrayList</span>&lt;&gt;());
                <span class="cls">SecurityContextHolder</span>.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}</pre></div>
  </div>
  ${quizBlock(7, "اختبار الجلسة السابعة — 10 أسئلة", "Session 7 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 8 =====
window.getSession8HTML = function(s) {
return hero(s,"08") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">🧪</span> ${L("لماذا نكتب اختبارات؟","Why write tests?")}</h3>
    <div class="explain-box"><p>${L("الكود بدون اختبارات = <strong>سيارة بدون فرامل</strong>. قد يعمل الآن لكن أي تعديل قد يكسر شيئاً آخر!","Code without tests = <strong>car without brakes</strong>. Works now but any change might break something else!")}</p>
      <div class="info-grid">
        <div class="info-card"><div class="ic-label">Unit Test</div><div class="ic-value">${L("اختبار وحدة صغيرة (method) منعزلة عن الباقي. سريع جداً.","Test small unit (method) isolated from rest. Very fast.")}</div></div>
        <div class="info-card"><div class="ic-label">Integration Test</div><div class="ic-value">${L("اختبار عدة مكونات معاً (Controller + Service + DB). أبطأ لكن أشمل.","Test multiple components together. Slower but comprehensive.")}</div></div>
      </div>
      <div class="highlight"><strong>AAA Pattern:</strong><br>Arrange = ${L("جهّز البيانات","Setup data")}<br>Act = ${L("نفّذ الكود","Execute code")}<br>Assert = ${L("تحقق من النتيجة","Verify result")}</div></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">🎭</span> ${L("Mockito — الكائنات الوهمية","Mockito — Mock Objects")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">BookServiceTest.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@ExtendWith</span>(<span class="cls">MockitoExtension</span>.<span class="kw">class</span>)
<span class="kw">class</span> <span class="cls">BookServiceTest</span> {
    <span class="ann">@Mock</span>
    <span class="kw">private</span> <span class="cls">BookRepository</span> repo; <span class="cmt">// ← كائن وهمي</span>

    <span class="ann">@InjectMocks</span>
    <span class="kw">private</span> <span class="cls">BookService</span> service; <span class="cmt">// ← يُحقن الـ Mock فيه</span>

    <span class="ann">@Test</span>
    <span class="kw">void</span> <span class="fn">shouldReturnBookById</span>() {
        <span class="cmt">// Arrange</span>
        <span class="cls">Book</span> book = <span class="kw">new</span> <span class="cls">Book</span>(<span class="num">1L</span>, <span class="str">"Test"</span>, <span class="str">"Author"</span>);
        when(repo.findById(<span class="num">1L</span>)).thenReturn(<span class="cls">Optional</span>.of(book));

        <span class="cmt">// Act</span>
        <span class="cls">Book</span> result = service.findById(<span class="num">1L</span>);

        <span class="cmt">// Assert</span>
        assertEquals(<span class="str">"Test"</span>, result.getTitle());
        verify(repo).findById(<span class="num">1L</span>); <span class="cmt">// ← تأكد أنه استُدعي</span>
    }
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🌐</span> ${L("MockMvc — اختبار Controller","MockMvc — Testing Controller")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">BookControllerTest.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@WebMvcTest</span>(<span class="cls">BookController</span>.<span class="kw">class</span>)
<span class="kw">class</span> <span class="cls">BookControllerTest</span> {
    <span class="ann">@Autowired</span>
    <span class="kw">private</span> <span class="cls">MockMvc</span> mockMvc;
    <span class="ann">@MockBean</span>
    <span class="kw">private</span> <span class="cls">BookService</span> service;

    <span class="ann">@Test</span>
    <span class="kw">void</span> <span class="fn">shouldReturnBooks</span>() <span class="kw">throws</span> <span class="cls">Exception</span> {
        when(service.findAll()).thenReturn(<span class="cls">List</span>.of(
            <span class="kw">new</span> <span class="cls">Book</span>(<span class="num">1L</span>, <span class="str">"Test"</span>, <span class="str">"Author"</span>)
        ));

        mockMvc.perform(get(<span class="str">"/api/books"</span>))
            .andExpect(status().isOk())
            .andExpect(jsonPath(<span class="str">"$[0].title"</span>).value(<span class="str">"Test"</span>));
    }
}</pre></div>
  </div>
  ${quizBlock(8, "اختبار الجلسة الثامنة — 10 أسئلة", "Session 8 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 9 =====
window.getSession9HTML = function(s) {
return hero(s,"09") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">📄</span> ${L("Pagination — تقسيم النتائج","Pagination — Split Results")}</h3>
    <div class="explain-box"><p>${L("إرجاع 10,000 سجل دفعة واحدة = <strong>كارثة في الأداء!</strong> Pagination يقسم النتائج لصفحات.","Returning 10,000 records at once = <strong>Performance disaster!</strong> Pagination splits results.")}</p>
      <div class="analogy">${L("📖 Pagination = فهرس كتاب. بدلاً من قراءة 500 صفحة دفعة واحدة، تقرأ صفحة صفحة.","📖 Pagination = Book index. Instead of reading 500 pages at once, read page by page.")}</div></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">${L("Controller مع Pagination","Controller with Pagination")}</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@GetMapping</span>
<span class="kw">public</span> <span class="cls">Page</span>&lt;<span class="cls">Book</span>&gt; <span class="fn">getAll</span>(
    <span class="ann">@RequestParam</span>(defaultValue = <span class="str">"0"</span>) <span class="kw">int</span> page,
    <span class="ann">@RequestParam</span>(defaultValue = <span class="str">"10"</span>) <span class="kw">int</span> size,
    <span class="ann">@RequestParam</span>(defaultValue = <span class="str">"title"</span>) <span class="type">String</span> sortBy) {
    <span class="cls">Pageable</span> pageable = <span class="cls">PageRequest</span>.of(page, size, <span class="cls">Sort</span>.by(sortBy));
    <span class="kw">return</span> repo.findAll(pageable);
}
<span class="cmt">// GET /api/books?page=0&size=5&sortBy=title</span></pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">✅</span> ${L("Bean Validation","Bean Validation")}</h3>
    <div class="explain-box"><p>${L("لا تثق ببيانات العميل أبداً! <strong>Validation</strong> يتحقق من البيانات قبل معالجتها.","Never trust client data! <strong>Validation</strong> verifies data before processing.")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">dto/BookDTO.java (${L("مع","with")} Validation)</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">public class</span> <span class="cls">BookDTO</span> {
    <span class="ann">@NotBlank</span>(message = <span class="str">"Title is required"</span>)
    <span class="kw">private</span> <span class="type">String</span> title;

    <span class="ann">@NotBlank</span>(message = <span class="str">"Author is required"</span>)
    <span class="kw">private</span> <span class="type">String</span> author;

    <span class="ann">@Min</span>(value = <span class="num">1</span>, message = <span class="str">"Price must be > 0"</span>)
    <span class="kw">private double</span> price;

    <span class="ann">@Email</span>(message = <span class="str">"Invalid email"</span>)
    <span class="kw">private</span> <span class="type">String</span> contactEmail;
}</pre></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">${L("استخدام @Valid في Controller","Using @Valid in Controller")}</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@PostMapping</span>
<span class="kw">public</span> <span class="cls">ResponseEntity</span>&lt;<span class="cls">Book</span>&gt; <span class="fn">create</span>(<span class="ann">@Valid</span> <span class="ann">@RequestBody</span> <span class="cls">BookDTO</span> dto) {
    <span class="cmt">// يصل هنا فقط إذا نجح الـ Validation</span>
    <span class="kw">return</span> <span class="cls">ResponseEntity</span>.status(<span class="num">201</span>).body(service.create(dto));
}</pre></div>
    <div class="explain-box"><p><strong>${L("أهم القيود:","Core Constraints:")}</strong></p>
      <table class="data-table"><tr><th>Annotation</th><th>${L("الوظيفة","Purpose")}</th></tr>
        <tr><td>@NotNull</td><td>${L("ليس null","Not null")}</td></tr>
        <tr><td>@NotEmpty</td><td>${L("ليس null وليس فارغ","Not null, not empty")}</td></tr>
        <tr><td>@NotBlank</td><td>${L("ليس null وليس فارغ وليس مسافات فقط","Not null, empty, or whitespace")}</td></tr>
        <tr><td>@Min / @Max</td><td>${L("الحد الأدنى والأقصى لرقم","Min and max for numbers")}</td></tr>
        <tr><td>@Size(min, max)</td><td>${L("طول النص","String length limit")}</td></tr>
        <tr><td>@Email</td><td>${L("صيغة email صحيحة","Valid email format")}</td></tr>
        <tr><td>@Pattern</td><td>${L("Regex مخصص","Custom Regex")}</td></tr></table></div>
  </div>
  ${quizBlock(9, "اختبار الجلسة التاسعة — 10 أسئلة", "Session 9 Quiz — 10 Questions")}
</div>`;
};

// ===== SESSION 10 =====
window.getSession10HTML = function(s) {
return hero(s,"10") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,212,255,0.1);">🐳</span> ${L("ما هو Docker؟","What is Docker?")}</h3>
    <div class="explain-box"><p><strong>Docker</strong> = ${L("أداة لتغليف التطبيق + بيئته في حاوية (Container) تعمل في أي مكان.","Tool to package app + environment in a Container that runs anywhere.")}</p>
      <div class="analogy">${L("📦 Docker = صندوق شحن. ضع التطبيق في الصندوق — يعمل في أي مكان: جهازك، السيرفر، السحابة!","📦 Docker = Shipping box. Put app in box — works anywhere!")}</div>
      <div class="info-grid">
        <div class="info-card"><div class="ic-label">Docker Image</div><div class="ic-value">${L("القالب الثابت (مثل الـ class). يُبنى من Dockerfile.","Static template (like class). Built from Dockerfile.")}</div></div>
        <div class="info-card"><div class="ic-label">Docker Container</div><div class="ic-value">${L("نسخة عاملة من الـ Image (مثل الـ object).","Running instance of Image (like object).")}</div></div>
      </div></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">📄</span> Dockerfile</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Dockerfile</span><span class="code-filename">Dockerfile</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="cmt"># Stage 1: Build</span>
<span class="kw">FROM</span> <span class="str">maven:3.9-eclipse-temurin-21</span> <span class="kw">AS</span> build
<span class="kw">WORKDIR</span> /app
<span class="kw">COPY</span> pom.xml .
<span class="kw">RUN</span> mvn dependency:go-offline
<span class="kw">COPY</span> src ./src
<span class="kw">RUN</span> mvn clean package -DskipTests

<span class="cmt"># Stage 2: Run</span>
<span class="kw">FROM</span> <span class="str">eclipse-temurin:21-jre</span>
<span class="kw">WORKDIR</span> /app
<span class="kw">COPY</span> --from=build /app/target/*.jar app.jar
<span class="kw">EXPOSE</span> <span class="num">8080</span>
<span class="kw">ENTRYPOINT</span> [<span class="str">"java"</span>, <span class="str">"-jar"</span>, <span class="str">"app.jar"</span>]</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🔗</span> docker-compose</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">YAML</span><span class="code-filename">docker-compose.yml</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">version</span>: <span class="str">"3.8"</span>
<span class="kw">services</span>:
  <span class="fn">app</span>:
    <span class="kw">build</span>: .
    <span class="kw">ports</span>: [<span class="str">"8080:8080"</span>]
    <span class="kw">environment</span>:
      - <span class="str">SPRING_PROFILES_ACTIVE=prod</span>
      - <span class="str">SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/myapp</span>
    <span class="kw">depends_on</span>: [db]
  <span class="fn">db</span>:
    <span class="kw">image</span>: <span class="str">mysql:8</span>
    <span class="kw">environment</span>:
      <span class="kw">MYSQL_ROOT_PASSWORD</span>: <span class="str">root</span>
      <span class="kw">MYSQL_DATABASE</span>: <span class="str">myapp</span>
    <span class="kw">ports</span>: [<span class="str">"3306:3306"</span>]</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(255,107,53,0.1);">⚙️</span> Spring Profiles</h3>
    <div class="explain-box"><p>${L("Profiles = إعدادات مختلفة حسب البيئة.","Profiles = different settings per environment.")}</p></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Properties</span><span class="code-filename">application-dev.properties</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">spring.datasource.url</span>=<span class="str">jdbc:h2:mem:testdb</span>
<span class="kw">spring.h2.console.enabled</span>=<span class="kw">true</span>
<span class="kw">spring.jpa.show-sql</span>=<span class="kw">true</span></pre></div>
    <div class="code-block"><div class="code-header"><span class="code-lang">Properties</span><span class="code-filename">application-prod.properties</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">spring.datasource.url</span>=<span class="str">jdbc:mysql://db:3306/myapp</span>
<span class="kw">spring.jpa.hibernate.ddl-auto</span>=<span class="str">validate</span>
<span class="kw">spring.jpa.show-sql</span>=<span class="kw">false</span></pre></div>
  </div>
  ${quizBlock(10, "اختبار الجلسة العاشرة — 10 أسئلة", "Session 10 Quiz — 10 Questions")}
</div>`;
};

// ===== PROJECT QUIZZES 11-14 =====
const quiz11 = {questions:[
  {ar:{q:"ما هي مشكلة N+1 وكيف نحلها في JPA؟",opts:["تحدث عند استدعاء العلاقات الكثيرة بلوب، ونحلها باستخدام @EntityGraph أو JOIN FETCH","لا توجد مشكلة بهذا الاسم في JPA","أخطاء في الـ Pagination","مشكلة في الـ Cache"],explanation:"المشكلة تحدث عند جلب كيان واحد ثم عمل استعلام منفصل لكل علاقة (N queries). نحلها بـ JOIN FETCH أو @EntityGraph."},en:{q:"What is the N+1 problem and how to solve it in JPA?",opts:["Happens when fetching Many relations in a loop, solved with @EntityGraph or JOIN FETCH","No such problem in JPA","Pagination errors","Cache issue"],explanation:"Problem occurs when fetching 1 entity then separate query for each relation (N queries). Solved with JOIN FETCH or @EntityGraph."},correct:0},
  {ar:{q:"أي Annotations نستخدمها لتفعيل وتشغيل الـ Caching في Spring Boot؟",opts:["@UseCache و @EnableCache","@EnableCaching على الـ Main Class و @Cacheable على الـ Method","@Cache فقط","@SaveToMemory"],explanation:"نفعل الـ Cache في خصائص التطبيق بـ @EnableCaching ونضعه على الدوال بـ @Cacheable."},en:{q:"Which annotations are used to enable and trigger Caching in Spring Boot?",opts:["@UseCache and @EnableCache","@EnableCaching on Main Class and @Cacheable on Method","@Cache only","@SaveToMemory"],explanation:"Enable with @EnableCaching in app config, and trigger on methods with @Cacheable."},correct:1},
  {ar:{q:"لماذا يعد الـ Cache مهماً في واجهة الـ Products؟",opts:["لتقليل الضغط على قاعدة البيانات للقوائم التي لا تتغير كثيراً (كالمنتجات الأكثر مبيعاً)","لكي نعمل بدون إنترنت","للحماية من الهاكرز","لحفظ كلمات المرور"],explanation:"Products تُقرأ آلاف المرات وتُعدل نادراً. جلبها من الـ Memory أسرع الملايين من المرات."},en:{q:"Why is caching important for Products API?",opts:["Reduce DB load for rarely changing lists (like top sellers)","To work offline","Hackers protection","Save passwords"],explanation:"Products are read thousands of times and updated rarely. Fetching from Memory is vastly faster."},correct:0},
  {ar:{q:"متى يجب إفراغ أو تحديث الـ Cache باستخدام @CacheEvict؟",opts:["عند الاستعلام عن المنتج","تلقائياً كل ثانية","عند تعديل أو حذف المنتج (Update/Delete)","لا يفرغ أبداً"],explanation:"إذا تعدل السعر ولم نفرغ الـ Cache، سيرى المستخدم السعر القديم!"},en:{q:"When should we clear/update cache using @CacheEvict?",opts:["When reading product","Automatically every second","When updating or deleting the product","Never clears"],explanation:"If price changes and we don't clear cache, user sees old price!"},correct:2},
  {ar:{q:"ماذا يعني Redis في هندسة السيرفرات؟",opts:["لغة برمجة","قاعدة بيانات In-Memory سريعة جداً تُستخدم كـ Cache موزّع","اسم سيرفر Linux","مكتبة واجهات"],explanation:"Redis هو أفضل خيار لـ Distributed Caching عندما يكون لديك أكثر من سيرفر Spring Boot."},en:{q:"What is Redis in server architecture?",opts:["Programming language","Blazing fast In-Memory database used as distributed cache","Linux server name","Frontend library"],explanation:"Redis is the top choice for Distributed Caching when you have multiple Spring Boot servers."},correct:1}
]};

const quiz12 = {questions:[
  {ar:{q:"ما هو الـ Optimistic Locking (@Version)؟",opts:["إغلاق التطبيق للصيانة","منع التعديل المتزامن بـ Version number يحمي من (Race Conditions)","تشفير كلمات المرور","إغلاق قاعدة البيانات"],explanation:"يحمي البيانات (كالمخزون) إذا حاول مستخدمان الشراء في نفس اللحظة (Race condition)."},en:{q:"What is Optimistic Locking (@Version)?",opts:["Close app for maintenance","Prevents concurrent modifications with a Version number (Race Conditions)","Hash passwords","Lock database"],explanation:"Protects data (like stock) if 2 users buy the exact last item simultaneously."},correct:1},
  {ar:{q:"ما هو الخطأ (Exception) الذي يُرمى عند حدوث تصادم في الـ Optimistic Locking؟",opts:["NullPointerException","ObjectOptimisticLockingFailureException","IndexOutOfBoundsException","OutOfMemoryError"],explanation:"Spring يُرمي هذا الخطأ إذا اختلف رقم الـ Version أثناء الحفظ، فنتمكن من إبلاغ المستخدم."},en:{q:"What Exception is thrown when an Optimistic Locking collision occurs?",opts:["NullPointerException","ObjectOptimisticLockingFailureException","IndexOutOfBoundsException","OutOfMemoryError"],explanation:"Spring throws this if Version number differs during save, allowing us to notify user."},correct:1},
  {ar:{q:"كيف يمكن عزل العمليات (Transaction Isolation) بدقة في Spring؟",opts:["@Isolation","@Transactional(isolation = Isolation.SERIALIZABLE)","بدون أنوتيشن","بإيقاف السيرفر"],explanation:"Isolation.SERIALIZABLE تُجبر العمليات المتزامنة على التنفيذ بالدور حرفياً (أبطأ ولكن آمن 100%)."},en:{q:"How to strictly isolate transactions in Spring?",opts:["@Isolation","@Transactional(isolation = Isolation.SERIALIZABLE)","No annotation","Stop server"],explanation:"SERIALIZABLE forces concurrent transactions to run strictly sequentially (slowest but 100% safe)."},correct:1},
  {ar:{q:"في الأنظمة الموزعة (Microservices)، كيف نعالج الطلبات بدلاً من @Transactional؟",opts:["Saga Pattern (التعويض إذا فشلت خطوة)","نضع كل شيء في خدمة واحدة","بـ SSH","بحذف الكود"],explanation:"لأن الفواتير والمخزن في قواعد مختلفة، نرسل أحداث وإذا فشلت خدمة، نرسل حدث تعويضي (Rollback)."},en:{q:"In Microservices, how to process orders instead of @Transactional?",opts:["Saga Pattern (Compensating transactions if step fails)","Put everything in one service","Via SSH","Delete code"],explanation:"Since billing & inventory are in separate DBs, we send events. If one fails, we send compensating event."},correct:0},
  {ar:{q:"ما الحدث (Event) الأنسب إرساله بعد بناء الـ Order؟",opts:["OrderCreatedEvent - لتقوم خدمة الإيميلات بالرد دون تعطيل عملية الدفع","OrderDeletedEvent","UserLoggedOutEvent","DatabaseClosedEvent"],explanation:"الـ Event Publishing (عبر ApplicationEventPublisher) يفصل العمليات الجانبية ويُسرّع استجابة الـ API."},en:{q:"Most appropriate Event to publish after Order creation?",opts:["OrderCreatedEvent - allows Email service to react without stalling checkout","OrderDeletedEvent","UserLoggedOutEvent","DatabaseClosedEvent"],explanation:"Event Publishing decouples side-effects to speed up API response."},correct:0}
]};

const quiz13 = {questions:[
  {ar:{q:"لماذا نستخدم Refresh Tokens ولا نكتفي بـ Access Token؟",opts:["لأسباب شكلية","لأن الـ Access Token يكون قصير الأجل (مثال ربع ساعة) للـ Security، فنستخدم Refresh Token السري لتجديده","لكي ندفع للـ API","لتخزين الصور"],explanation:"إذا سُرق Access Token قصير الأجل لن يستفيد الهاكر طويلاً. Refresh Token طويل الأجل ويحفظ بـ HttpOnly Cookie."},en:{q:"Why use Refresh Tokens instead of just Access Tokens?",opts:["Looks cool","Access Tokens are short-lived (e.g. 15m) for security. Refresh Token securely renews it.","To pay for API","To store images"],explanation:"If a short-lived token is stolen, damage is minimal. Refresh Token is long-lived & strictly stored."},correct:1},
  {ar:{q:"ما هو Stripe Webhook؟",opts:["نوع من الـ Web Design","نقطة اتصال (Endpoint) في سيرفرك يُكلمها Stripe ليخبرك بنجاح أو فشل دفع العميل المستقل","أداة لاختراق المواقع","كود HTML"],explanation:"Webhook يسمح لـ Stripe بإخبارك في الخلفية باكتساب الأموال حتى لو أغلق العميل المُتصفح."},en:{q:"What is a Stripe Webhook?",opts:["Web design type","Endpoint on your server that Stripe calls to notify you of async payment success/failure","Hacking tool","HTML code"],explanation:"Webhook lets Stripe inform you asynchronously in the background even if user closes browser."},correct:1},
  {ar:{q:"كيف تتأكد أن الـ Webhook قادم فعلاً من Stripe وليس من هاكر؟",opts:["بالقسم (Swearing)","عبر التحقق من ה- HMAC Signature الموجود في الـ Header للطلب","بسؤاله من أنت","بتجاهل الأمر"],explanation:"Stripe يُوقّع الطلب بمفتاح سري (Webhook Secret)، وسيرفرك يتأكد (Verify Signature) لضمان موثوقيته."},en:{q:"How to guarantee a Webhook is actually from Stripe and not a hacker?",opts:["Swearing","By verifying the HMAC Signature present in the request header","Asking who it is","Ignoring it"],explanation:"Stripe signs the payload using a Webhook Secret. Your server verifies it to ensure authenticity."},correct:1},
  {ar:{q:"كيف ننفذ Rate Limiting لنحمي سيرفر الـ Auth من الـ Brute Force؟",opts:["Bucket4j مع Redis","حذف الفرونت اند","فصل كابل الإنترنت","إعادة التشغيل متكررة"],explanation:"Bucket4j (مع مقيّدات كـ Redis) تسمح للمستخدم بعدد محدود من محاولات إدخال الرمز الخاطئ بالدقيقة."},en:{q:"How to implement Rate Limiting to protect Auth server from Brute Force?",opts:["Bucket4j with Redis","Delete frontend","Unplug internet","Reboot frequently"],explanation:"Bucket4j restricts the amount of failed login requests an IP can make per minute."},correct:0},
  {ar:{q:"ما هو الـ OAuth2؟",opts:["نقطة الضعف رقم 2","بروتوكول التفويض الذي يتيح 'تسجيل الدخول باستخدام Google / Facebook'","لغة مصفوفات","متصفح ألعاب"],explanation:"إضافة Spring Boot OAuth2 Client تُسهّل جداً نظام الدخول الاجتماعي الآمن."},en:{q:"What is OAuth2?",opts:["Vulnerability version 2","Authorization protocol allowing 'Login with Google / Facebook'","Array language","Gaming browser"],explanation:"Adding Spring Boot OAuth2 Client natively handles secure Social Login flows."},correct:1}
]};

const quiz14 = {questions:[
  {ar:{q:"ما هي أداة Flyway؟",opts:["لألعاب الطيران","أداة لتتبع ورصد تغييرات قواعد البيانات (Database Migration) وإدارة إصداراتها","محول صيغ","مسرّع واجهات"],explanation:"Flyway يحفظ سجل لكل تعديل بـ SQL، فيضمن تشابه الداتابيز بين أجهزة كل المبرمجين والسيرفر الحي."},en:{q:"What is Flyway?",opts:["Flight game","Version control tool for Database Migrations (tracking SQL changes)","Format converter","Frontend accelerator"],explanation:"Flyway keeps a history of SQL scripts, ensuring DB structural consistency across developers & live server."},correct:1},
  {ar:{q:"ماذا نفعل لجمع قياسات وأداء السيرفر الحي؟",opts:["نقرأ اللوجز (Logs) يدوياً كل يوم","نستخدم Spring Boot Actuator مع Prometheus لعرضها رسومياً بـ Grafana","نستأجر موظفاً","تجاهل الأمر"],explanation:"Actuator يصدر معلومات الـ CPU والـ Memory عبر endpoint اسمه /actuator/prometheus لترقبه أداة Grafana."},en:{q:"How to collect live server metrics and performance?",opts:["Read logs manually everyday","Use Spring Boot Actuator with Prometheus to visualize via Grafana","Hire someone","Ignore it"],explanation:"Actuator exposes CPU & Memory data via /actuator/prometheus for Grafana visualization."},correct:1},
  {ar:{q:"ما هو Distributed Tracing في الأنظمة الموزعة للـ E-Commerce؟",opts:["تتبع سرقة البضائع","إرفاق Trace ID مميز عبر الـ Headers لكل طلب يمر بجميع الخوادم (Microservices) لمعرفة سبب التأخير","نوع من الرسوميات","نظام تشفير"],explanation:"MDC و Micrometer Tracing يُسهّل تتبع الطلب من بوابة الـ Gateway وصولاً للـ DB في ملف لوج واحد محدد!"},en:{q:"What is Distributed Tracing in Microservices?",opts:["Tracking stolen goods","Attaching a unique Trace ID across Headers to track a request path among all servers to debug delays","Graphics type","Encryption"],explanation:"MDC & Micrometer Tracing enables tracking a request path from Gateway to DB via one shared Trace ID!"},correct:1},
  {ar:{q:"في CI/CD (كـ GitHub Actions)، ما الخطوات الصحيحة قبل الرفع؟",opts:["رفع الكود مباشرة","عمل Checkout -> تشغيل Tests -> بناء Docker Image -> رفعها לـ DockerHub","حذف قواعد البيانات","الانتظار أسبوعان"],explanation:"Continuous Integration يتأكد تلقائياً أن كودك اجتاز كل الـ Tests قبل تجميعه ونشره."},en:{q:"In CI/CD (like GitHub Actions), proper steps before deploy?",opts:["Push directly","Checkout code -> Run Unit Tests -> Build Docker Image -> Push to DockerHub","Drop DB","Wait 2 weeks"],explanation:"Continuous Integration mathematically ensures your code passes all tests before generating deployment package."},correct:1},
  {ar:{q:"لقد أنهيت 14 جلسة وبنيت متجراً كاملاً بـ Spring Boot.. ما الوصف الأقرب لمستواك الآن؟",opts:["مبتدئ بالكاد يعرف Java","مطور Backend قادر على بناء وهيكلة وتأمين ونشر REST APIs حقيقية","مطور Frontend","طالب لم يبدأ بعد"],explanation:"تهانينا يا وحش! أنت الآن مطور باكند محترف. استمر بالتطبيق العملي!"},en:{q:"Finished 14 sessions building a complete Spring Boot store.. closest description of your level now?",opts:["Beginner barely knows Java","Backend Developer capable of building, structuring, securing, and deploying real REST APIs","Frontend Developer","Student hasn't started yet"],explanation:"Congratulations beast! You're a pro backend dev now. Keep practicing!"},correct:1}
]};

// ===== PROJECT SESSION 11 =====
window.getSession11HTML = function(s) {
return hero(s,"11") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(255,107,53,0.1);">🏬</span> ${L("حلول قوية لـ Product API (Enterprise)","Enterprise Solutions for Product API")}</h3>
    <div class="explain-box"><p>${L("أنت الآن مطور متقدم. لن نكتفي بكتابة API عادي؛ العميل يشتكي أن الصفحة الرئيسية بطيئة جداً وتأخذ 5 ثواني للتحميل! سنقوم بحل مشكلة <code>N+1 Queries</code> وتفعيل <code>Redis Caching</code>.","You are a Senior dev now. Just building a basic API is not enough; the client complains the homepage is too slow (5 seconds)! We will fix the <code>N+1 Queries</code> problem and implement <code>Redis Caching</code>.")}</p>
      <div class="steps">
        <div class="step-item"><div class="step-num">1</div><div class="step-content"><h4>${L("حل مشكلة الـ N+1 Query","Solving the N+1 Query Problem")}</h4><p>${L("جلب قائمة منتجات مع القسم الخاص بكل منتج قد يُولد 100 استعلام منفصل للـ Category. نستخدم @EntityGraph لدفع JPA لجلب البيانات بـ JOIN واحد!","Fetching Products and mapping Categories lazily causes 100 separate Category queries. We use @EntityGraph to force a single JOIN fetch!")}</p></div></div>
        <div class="step-item"><div class="step-num">2</div><div class="step-content"><h4>${L("البحث المعقد بـ Criteria API","Complex Search with Criteria/Specifications")}</h4><p>${L("استخدام Spring Data Specifications لـ الفلاتر المتعددة المعقدة (السعر، الكلمة، القسم).","Utilize Spring Data Specifications for complex dynamic filtering (Price ranges, Keywords, Categories).")}</p></div></div>
        <div class="step-item"><div class="step-num">3</div><div class="step-content"><h4>${L("الكاشنج مع Redis","Caching with Redis")}</h4><p>${L("المنتجات الأكثر مبيعاً نادراً ما تتغير. حفظها في الذاكرة لتخفيض وقت الاستجابة من 500ms إلى 5ms!","Top sellers rarely change. Storing them in memory decreases response time from 500ms to 5ms!")}</p></div></div>
      </div>
    </div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">🗄️</span> ${L("خطوة 1: حل الـ N+1 في الـ Repository","Step 1: Fixing N+1 in Repository")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">repository/ProductRepository.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">public interface</span> <span class="cls">ProductRepository</span> <span class="kw">extends</span> <span class="cls">JpaRepository</span>&lt;<span class="cls">Product</span>, <span class="type">Long</span>&gt;, <span class="cls">JpaSpecificationExecutor</span>&lt;<span class="cls">Product</span>&gt; {
    
    <span class="cmt">// 🚀 @EntityGraph تخبر الـ JPA لجلب (Category) فوراً بـ SQL LEFT JOIN وتمنع N+1!</span>
    <span class="ann">@EntityGraph</span>(attributePaths = {<span class="str">"category"</span>})
    <span class="cls">Page</span>&lt;<span class="cls">Product</span>&gt; <span class="fn">findByStockQuantityGreaterThan</span>(<span class="kw">int</span> minStock, <span class="cls">Pageable</span> pageable);
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">⚡</span> ${L("خطوة 2: تفعيل وتقسيم الكاشنج (Caching)","Step 2: Activating Application Caching")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">service/ProductService.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Service</span>
<span class="kw">public class</span> <span class="cls">ProductService</span> {

    <span class="ann">@Autowired</span> <span class="kw">private</span> <span class="cls">ProductRepository</span> productRepo;

    <span class="cmt">// أول مبرمج يستدعي الدالة يقرأ من الـ DB وتُحفظ في الكاش، الباقي يقرؤها فوراً (0ms)!</span>
    <span class="ann">@Cacheable</span>(value = <span class="str">"products"</span>, key = <span class="str">"'topSellers'"</span>)
    <span class="kw">public</span> <span class="cls">List</span>&lt;<span class="cls">ProductDTO</span>&gt; <span class="fn">getTopSellingProducts</span>() {
        <span class="kw">return</span> productRepo.findTopSellers(); <span class="cmt">// Simulated slow query</span>
    }

    <span class="cmt">// احترس: عند التعديل أو الحذف يجب إفراغ الكاش حتى لا تباع المنتجات المنتهية!</span>
    <span class="ann">@CacheEvict</span>(value = <span class="str">"products"</span>, allEntries = <span class="kw">true</span>)
    <span class="kw">public void</span> <span class="fn">updatePrice</span>(<span class="type">Long</span> id, <span class="kw">double</span> newPrice) {
        <span class="cls">Product</span> p = productRepo.findById(id).get();
        p.setPrice(newPrice);
        productRepo.save(p);
    }
}</pre></div>
  </div>

  ${quizBlock(11, "اختبار متقدم: الجلسة 11", "Advanced Quiz: Session 11")}
</div>`;
};

// ===== PROJECT SESSION 12 =====
window.getSession12HTML = function(s) {
return hero(s,"12") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(255,107,53,0.1);">🛒</span> ${L("مستوى متقدم: السباق والتأمين (Race Conditions & Distributed Logic)","Advanced: Race Conditions & Distributed Logic")}</h3>
    <div class="explain-box"><p>${L("الحالة كارثية! متجرك لديه حذاء واحد في المخزون، وضغط عليه عميلان 'شراء' في ذات اللحظة! النظام القديم باع الحذاء للاثنين (تعامد البيانات)! سنحمي هذا باستخدام Optimistic Locking، ونفهم فكرة الـ Saga Pattern.","Disaster strike! You have 1 pair of shoes left, 2 customers hit 'Buy' at the EXACT same millisecond! The weak system sells it to both. We will prevent this using Optimistic Locking (@Version) and discuss the Saga Pattern.")}</p>
      <div class="steps">
        <div class="step-item"><div class="step-num">1</div><div class="step-content"><h4>${L("@Version للحماية الإيجابية","@Version Optimistic Locking")}</h4><p>${L("إضافة حق Version للمنتج. JPA لا يخزن الكيان إذا تعدل الـ Version بواسطه خيط آخر (Thread) ليرمي ObjectOptimisticLockingFailureException!","Add a Version field. JPA rejects Save if the Version differs from what was queried, throwing ObjectOptimisticLockingFailureException!")}</p></div></div>
        <div class="step-item"><div class="step-num">2</div><div class="step-content"><h4>${L("أحداث التطبيق (Event Publishing)","Application Event Publishing")}</h4><p>${L("عند نجاح الطلب، نريد إرسال إيميل وفاتورة PDF، دون إجبار العميل على الانتظار. نستخدم @Async و ApplicationEventPublisher.","On Order Success, we want to email a PDF. Rather than blocking the user response locally, we use Spring ApplicationEventPublisher and @Async.")}</p></div></div>
      </div>
    </div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">🛡️</span> ${L("خطوة 1: تأمين الكيان بالـ @Version","Step 1: Securing Entity with @Version")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">model/Product.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Entity</span>
<span class="kw">public class</span> <span class="cls">Product</span> {
    <span class="ann">@Id</span> <span class="ann">@GeneratedValue</span>
    <span class="kw">private</span> <span class="type">Long</span> id;

    <span class="kw">private</span> <span class="type">String</span> title;
    <span class="kw">private int</span> stockQuantity;

    <span class="cmt">// 🚀 سحر الـ Optimistic Locking</span>
    <span class="cmt">// عندما یحدث Update، JPA یزید الرقم تلقائياً. لو حاولا شخصان الدفع سيُقبل واحد ويرفض الآخر.</span>
    <span class="ann">@Version</span>
    <span class="kw">private</span> <span class="cls">Long</span> version;
}</pre></div>

    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">exception/GlobalExceptionHandler.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@ControllerAdvice</span>
<span class="kw">public class</span> <span class="cls">GlobalExceptionHandler</span> {

    <span class="cmt">// نلتقط خطأ السباق، ونقول للعميل أن الكمية لم تعد متاحة</span>
    <span class="ann">@ExceptionHandler</span>(<span class="cls">ObjectOptimisticLockingFailureException</span>.class)
    <span class="kw">public</span> <span class="cls">ResponseEntity</span>&lt;<span class="type">String</span>&gt; <span class="fn">handleRaceCondition</span>(<span class="cls">ObjectOptimisticLockingFailureException</span> ex) {
        <span class="kw">return</span> <span class="cls">ResponseEntity</span>.status(409)
            .body(<span class="str">"عذراً! يبدو أن مستخدماً آخر اشترى آخر قطعة للتو."</span>);
    }
}</pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">📢</span> ${L("خطوة 2: فصل العمليات بـ Events","Step 2: Decoupling with Events")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">service/OrderService.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@Service</span>
<span class="kw">public class</span> <span class="cls">OrderService</span> {

    <span class="ann">@Autowired</span> <span class="kw">private</span> <span class="cls">ApplicationEventPublisher</span> publisher;

    <span class="ann">@Transactional</span>
    <span class="kw">public</span> <span class="cls">Order</span> <span class="fn">checkoutCart</span>(<span class="type">Long</span> userId) {
        <span class="cmt">// .. منطق الدفع وخصم المخزون وإنشاء الطلب ..</span>
        <span class="cls">Order</span> savedOrder = orderRepo.save(order);
        
        <span class="cmt">// 🔥 إطلاق الحدث! الدالة تُرجع النتيجة للـ Client فوراً بينما خدمة الإيميلات تستقبله في الخلفية</span>
        publisher.publishEvent(<span class="kw">new</span> <span class="cls">OrderCreatedEvent</span>(<span class="kw">this</span>, savedOrder.getId()));
        
        <span class="kw">return</span> savedOrder;
    }
}</pre></div>
  </div>

  ${quizBlock(12, "اختبار متقدم: الجلسة 12", "Advanced Quiz: Session 12")}
</div>`;
};

// ===== PROJECT SESSION 13 =====
window.getSession13HTML = function(s) {
return hero(s,"13") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(255,107,53,0.1);">🔐</span> ${L("مستوى متقدم: Webhooks و Refresh Tokens","Advanced: Webhooks & Refresh Tokens")}</h3>
    <div class="explain-box"><p>${L("الـ <code>JWT</code> العادي قصير الأجل لحمايته إذا سُرق. ماذا سيحدث إذا انتهى أثناء استخدام العميل؟ سنبني نظام مسار <code>Refresh Token</code> لتجديده صمتاً! وأيضاً سندمج الدفع عبر الاستماع لـ <code>Stripe Webhooks</code> الحقيقية بشكل آمن لمنع الاحتيال المالي.","Basic <code>JWT</code> is short-lived. What happens when it expires while user is browsing? We will build a <code>Refresh Token</code> flow to renew silently! Also, we handle payments via secure <code>Stripe Webhooks</code> parsing HMAC signatures.")}</p>
      <div class="steps">
        <div class="step-item"><div class="step-num">1</div><div class="step-content"><h4>${L("Refresh Token Flow","Refresh Token Flow")}</h4><p>${L("Login يُرجع Access Token لمدة ربع ساعة، و Refresh Token يُحفظ في قاعدة البيانات كنوع (HttpOnly Cookie) لمدة شهر.","Login returns 15m Access Token, and a monthly Refresh Token stored in Auth DB and HttpOnly Cookies.")}</p></div></div>
        <div class="step-item"><div class="step-num">2</div><div class="step-content"><h4>${L("Stripe Webhook Controller","Stripe Webhook Controller")}</h4><p>${L("نقطة اتصال /api/webhooks تستقبل إشعاراً آلياً من Stripe عند نجاح الدفع (Async) فتجعل الطلب PAID.","Endpoint /api/webhooks receives auto notifications from Stripe validating async success, turning Order to PAID.")}</p></div></div>
      </div>
    </div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">🌐</span> ${L("الجزء الأصعب: Webhook Signatures","The Tricky Part: Webhook Signatures")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Java</span><span class="code-filename">controller/WebhookController.java</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="ann">@RestController</span> <span class="ann">@RequestMapping</span>(<span class="str">"/api/webhooks"</span>)
<span class="kw">public class</span> <span class="cls">WebhookController</span> {

    <span class="ann">@Value</span>(<span class="str">"${stripe.webhook.secret}"</span>)
    <span class="kw">private</span> <span class="type">String</span> endpointSecret;

    <span class="ann">@PostMapping</span>(<span class="str">"/stripe"</span>)
    <span class="kw">public</span> <span class="cls">ResponseEntity</span>&lt;<span class="type">String</span>&gt; <span class="fn">handleStripeEvent</span>(
        <span class="ann">@RequestBody</span> <span class="type">String</span> payload, 
        <span class="ann">@RequestHeader</span>(<span class="str">"Stripe-Signature"</span>) <span class="type">String</span> sigHeader) {
        
        <span class="cls">Event</span> event = <span class="kw">null</span>;
        <span class="kw">try</span> {
            <span class="cmt">// 🚀 توقيع HMAC ـ سيفشل لو حاول هاكر العبث بمحتوى الـ String (payload)</span>
            event = <span class="cls">Webhook</span>.constructEvent(payload, sigHeader, endpointSecret);
        } <span class="kw">catch</span> (<span class="cls">SignatureVerificationException</span> e) {
            <span class="kw">return</span> <span class="cls">ResponseEntity</span>.status(400).body(<span class="str">"Invalid signature"</span>);
        }

        <span class="cmt">// تنفيذ العمل إذا الدفع نجح تماماً</span>
        <span class="kw">if</span> (<span class="str">"payment_intent.succeeded"</span>.equals(event.getType())) {
            <span class="cls">PaymentIntent</span> intent = (<span class="cls">PaymentIntent</span>) event.getDataObjectDeserializer().getObject().get();
            <span class="type">Long</span> orderId = <span class="type">Long</span>.valueOf(intent.getMetadata().get(<span class="str">"orderId"</span>));
            orderService.markAsPaid(orderId);
        }
        
        <span class="kw">return</span> <span class="cls">ResponseEntity</span>.ok().build();
    }
}</pre></div>
  </div>

  ${quizBlock(13, "اختبار متقدم: الجلسة 13", "Advanced Quiz: Session 13")}
</div>`;
};

// ===== PROJECT SESSION 14 =====
window.getSession14HTML = function(s) {
return hero(s,"14") + `<div class="content">
  <div class="teach-section"><h3><span class="icon" style="background:rgba(255,107,53,0.1);">👔</span> ${L("السيناريو المعماري الأخير: Metrics, Flyway و CI/CD","Architectural Scenario: Metrics, Flyway, CI/CD")}</h3>
    <div class="explain-box"><p>${L("الأنظمة الحية تحتاج لإدارة الهجرات (كيف نُحدّث الجداول دون تدميرها؟) بـ <code>Flyway</code>! كما نحتاج لربط لوحة المؤشرات للمراقبة عبر Prometheus لمعرفة الاستهلاك الفعلي للميموري. ثم دمج كل هذا مع CI/CD!","Live systems require DB migrations (how to alter tables safely?) via <code>Flyway</code>! We also expose metrics via Prometheus to know Memory usage in Grafana. Everything piped via CI/CD!")}</p>
      <div class="steps">
        <div class="step-item"><div class="step-num">1</div><div class="step-content"><h4>${L("إدارة جداول الـ Database (Flyway)","Database Migrations (Flyway)")}</h4><p>${L("ملفات SQL توضع بمجلد db/migration مثل V1__init.sql. يقوم Spring بتحديث قاعدة بيانات المطورين والسيرفر آلياً.","SQL files in db/migration (e.g. V1__init.sql). Spring alters definitions consistently across locally & prod.")}</p></div></div>
        <div class="step-item"><div class="step-num">2</div><div class="step-content"><h4>${L("مراقبة الأداء بروميثيوس (Prometheus)","Performance metrics via Prometheus")}</h4><p>${L("إضافة Actuator وتفعيل Endpoint /actuator/prometheus ليتم سحب المقاييس لداشبورد جرافانا الرسومي.","Adding Actuator mapping Prometheus so DevOps Grafana Dashboard scans active CPU/Mem loads.")}</p></div></div>
        <div class="step-item"><div class="step-num">3</div><div class="step-content"><h4>${L("مهمة CI/CD","CI/CD GitHub Actions")}</h4><p>${L("Pipeline أوتوماتيكي: عند كل Push, يجرب السيرفر Github جميع الوحدة (Tests). إذا نجح يبني صورة Docker.","Automated Pipeline: Every Push executes JUnit Tests on GitHub. If green, builds minimal Docker container.")}</p></div></div>
      </div>
    </div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(0,255,157,0.1);">📊</span> ${L("خطوة 1: تشغيل المراقبة Actuator","Step 1: Enabling Actuator Monitoring")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">Properties</span><span class="code-filename">application-prod.properties</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="cmt"># تفعيل المراقبة الشاملة (للمسؤولين ولخوادم Prometheus فقط)</span>
<span class="kw">management.endpoints.web.exposure.include</span> = health,info,prometheus
<span class="kw">management.endpoint.health.show-details</span> = always

<span class="cmt"># إعدادات أمان: حماية مسارات Actuator عبر SecurityFilterChain</span>
<span class="cmt"># .requestMatchers("/actuator/**").hasRole("ADMIN")</span></pre></div>
  </div>

  <div class="teach-section"><h3><span class="icon" style="background:rgba(167,139,250,0.1);">🚀</span> ${L("خطوة 2: صياغة CI/CD Pipeline Build","Step 2: Crafting CI/CD Pipeline")}</h3>
    <div class="code-block"><div class="code-header"><span class="code-lang">YAML</span><span class="code-filename">.github/workflows/deploy.yml</span><button class="copy-btn" onclick="copyCode(this)">copy</button></div>
      <pre><span class="kw">name</span>: <span class="str">Java CI with Maven and Docker</span>
<span class="kw">on</span>:
  <span class="kw">push</span>:
    <span class="kw">branches</span>: [ <span class="str">"main"</span> ]

<span class="kw">jobs</span>:
  <span class="fn">build</span>:
    <span class="kw">runs-on</span>: <span class="str">ubuntu-latest</span>
    <span class="kw">steps</span>:
    - <span class="kw">uses</span>: <span class="str">actions/checkout@v3</span>
    
    - <span class="kw">name</span>: <span class="str">Set up JDK 17</span>
      <span class="kw">uses</span>: <span class="str">actions/setup-java@v3</span>
      <span class="kw">with</span>:
        <span class="kw">java-version</span>: <span class="str">'17'</span>
        
    - <span class="kw">name</span>: <span class="str">Run Tests & Package JAR</span>
      <span class="cmt"># التأكد المطلق قبل البناء من اجتياز كل Tests!</span>
      <span class="kw">run</span>: <span class="str">mvn -B package --file pom.xml</span>
      
    - <span class="kw">name</span>: <span class="str">Build Docker Image & Push to AWS ECR / DockerHub</span>
      <span class="kw">run</span>: <span class="str">docker build -t mystore/api:latest .</span></pre></div>
    <div class="tip-box"><div class="tip-label">🏆 ${L("إنجاز هندسي ضخم!","Massive Engineering Feat!")}</div><p>${L("أنت الآن مهندس حلول برمجية (Solutions Architect) فخور بقدراته في تأمين المعاملات والعمليات العميقة في المتاجر الكبرى!","You are now a proud Solutions Architect with capabilities of securing deep enterprise store operations!")}</p></div>
  </div>

  ${quizBlock(14, "اختبار متقدم: الجلسة 14", "Advanced Quiz: Session 14")}
</div>`;
};

// ===== APP LOGIC =====
let activeSessionId = 1;

function rebuildAll() {
    buildSidebar();
    showSession(activeSessionId);
}

function buildSidebar() {
    const navItems = document.getElementById('nav-items');
    if (!navItems) return;
    navItems.innerHTML = '';
    
    let isProjectSectionStarted = false;
    
    sessions.forEach(s => {
        if (s.type === 'project' && !isProjectSectionStarted) {
            isProjectSectionStarted = true;
            const divider = document.createElement('div');
            divider.className = 'nav-divider';
            divider.textContent = L('المشروع العملي (E-Commerce)', 'Practical Project (E-Commerce)');
            navItems.appendChild(divider);
        }
    
        const div = document.createElement('div');
        div.className = `session-nav-item ${s.type === 'project' ? 'project' : ''} ${s.id === activeSessionId ? 'active' : ''}`;
        div.onclick = () => showSession(s.id);
        
        const title = L(s.ar.title, s.en.title);
        div.innerHTML = `<div class="num">${String(s.id).padStart(2,'0')}</div><div>${title}</div>`;
        navItems.appendChild(div);
    });
}

function showSession(id) {
    activeSessionId = id;
    
    // Update sidebar active state
    document.querySelectorAll('.session-nav-item').forEach((el, index) => {
        if (sessions[index].id === id) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });

    const s = sessions.find(x => x.id === id);
    const main = document.getElementById('main-content');
    if (!main) return;
    
    window.scrollTo(0, 0);
    const fn = window['getSession' + id + 'HTML'];
    if (fn) {
        main.innerHTML = fn(s);
    } else {
        main.innerHTML = `<div style="padding:40px">${L('المحتوى غير متوفر حالياً', 'Content not available yet')}</div>`;
    }
    
    setupQuiz(id);
}

function copyCode(btn) {
    const pre = btn.parentElement.nextElementSibling;
    const text = pre.innerText;
    navigator.clipboard.writeText(text).then(() => {
        const orig = btn.innerText;
        btn.innerText = L('تم النسخ!', 'Copied!');
        setTimeout(() => btn.innerText = orig, 1500);
    });
}

// ===== QUIZ ENGINE =====
let quizScores = {};

function setupQuiz(sessionId) {
    const qData = eval('quiz' + sessionId);
    if (!qData) return;
    
    const container = document.getElementById('quiz-' + sessionId);
    if (!container) return;
    
    let html = `<div class="quiz-header">
        <h3>${L('اختبار المعرفة', 'Knowledge Quiz')}</h3>
        <div class="quiz-progress">${L('0 من', '0 of')} ${qData.questions.length}</div>
    </div><div class="quiz-body">`;
    
    qData.questions.forEach((qObj, index) => {
        const q = L(qObj.ar, qObj.en);
        const letters = ['A','B','C','D'];
        html += `<div class="q-block" id="qblock-${sessionId}-${index}" style="margin-bottom:30px; ${index>0?'display:none;':''}">
            <div class="q-text">${index+1}. ${q.q}</div>
            <div class="options">`;
        
        q.opts.forEach((opt, optIdx) => {
            html += `<div class="option" onclick="checkAnswer(${sessionId}, ${index}, ${optIdx}, ${qObj.correct})">
                <div class="opt-letter">${letters[optIdx]}</div>
                <div>${opt}</div>
            </div>`;
        });
        
        html += `</div>
            <div class="q-feedback" id="qfeed-${sessionId}-${index}">
                <strong>${L('توضيح:', 'Explanation:')}</strong> ${q.explanation}
                <div style="margin-top:15px">
                    <button class="btn btn-primary" onclick="nextQuestion(${sessionId}, ${index})">
                        ${index === qData.questions.length - 1 ? L('إنهاء الاختبار', 'Finish Quiz') : L('السؤال التالي', 'Next Question')}
                    </button>
                </div>
            </div>
        </div>`;
    });
    
    html += `</div>
    <div class="quiz-result" id="qresult-${sessionId}">
        <div class="result-score" id="qscore-${sessionId}">0%</div>
        <div class="result-stars">⭐</div>
        <h3 class="result-label" id="qlabel-${sessionId}"></h3>
        <p class="result-msg" id="qmsg-${sessionId}"></p>
        <button class="btn btn-primary" onclick="showSession(${sessionId})">${L('إعادة الاختبار', 'Retake Quiz')}</button>
    </div>`;
    
    container.innerHTML = html;
    quizScores[sessionId] = 0;
}

function checkAnswer(sid, qIdx, selectedIdx, correctIdx) {
    const block = document.getElementById(`qblock-${sid}-${qIdx}`);
    const options = block.querySelectorAll('.option');
    if (block.classList.contains('answered')) return;
    block.classList.add('answered');
    
    const isCorrect = (selectedIdx === correctIdx);
    if (isCorrect) quizScores[sid]++;
    
    options.forEach((opt, i) => {
        opt.classList.add('disabled');
        if (i === correctIdx) opt.classList.add('correct');
        else if (i === selectedIdx && !isCorrect) opt.classList.add('wrong');
    });
    
    const feed = document.getElementById(`qfeed-${sid}-${qIdx}`);
    feed.className = 'q-feedback show ' + (isCorrect ? 'ok' : 'fail');
}

function nextQuestion(sid, currentIdx) {
    const qData = eval('quiz' + sid);
    document.getElementById(`qblock-${sid}-${currentIdx}`).style.display = 'none';
    
    if (currentIdx + 1 < qData.questions.length) {
        document.getElementById(`qblock-${sid}-${currentIdx+1}`).style.display = 'block';
        document.querySelector(`#quiz-${sid} .quiz-progress`).innerText = 
            `${L(currentIdx+1 + ' من', currentIdx+1 + ' of')} ${qData.questions.length}`;
    } else {
        showQuizResult(sid);
    }
}

function showQuizResult(sid) {
    const qData = eval('quiz' + sid);
    const total = qData.questions.length;
    const score = quizScores[sid];
    const perc = Math.round((score / total) * 100);
    
    document.querySelector(`#quiz-${sid} .quiz-body`).style.display = 'none';
    document.querySelector(`#quiz-${sid} .quiz-header`).style.display = 'none';
    const resEl = document.getElementById(`qresult-${sid}`);
    resEl.style.display = 'block';
    
    document.getElementById(`qscore-${sid}`).innerText = perc + '%';
    
    let msgAr = "", msgEn = "";
    if (perc === 100) {
        msgAr = "أداء مثالي! أنت وحش الـ Spring Boot!";
        msgEn = "Perfect performance! You are a Spring Boot beast!";
    } else if (perc >= 70) {
        msgAr = "عمل رائع! استمر بالتقدم.";
        msgEn = "Great job! Keep moving forward.";
    } else {
        msgAr = "تحتاج للمراجعة قليلاً، لا تستسلم!";
        msgEn = "You need a little review, don't give up!";
    }
    
    document.getElementById(`qlabel-${sid}`).innerText = L('النتيجة النهائية', 'Final Result');
    document.getElementById(`qmsg-${sid}`).innerText = L(msgAr, msgEn);
}

// INITIALIZE APP
document.addEventListener('DOMContentLoaded', () => {
    setLang(LANG); // This triggers rebuildAll
});
