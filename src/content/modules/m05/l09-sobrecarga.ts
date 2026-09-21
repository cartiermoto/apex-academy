import type { Lesson } from "@/lib/types";

export const l09Sobrecarga: Lesson = {
  id: "m05-l09",
  slug: "sobrecarga-vs-sobrescritura",
  n: 9,
  kind: "lesson",
  minutes: 18,
  title: { es: "Sobrecarga vs sobrescritura", en: "Overloading vs overriding" },
  summary: {
    es: "Dos palabras parecidas para dos ideas distintas: varios métodos con el mismo nombre y distintos parámetros, frente a una hija que sustituye el método de su padre.",
    en: "Two similar words for two different ideas: several methods with the same name and different parameters, versus a child replacing its parent's method.",
  },
  analogy: {
    es: "«Nuevo contacto» desde la cuenta o desde la pestaña (sobrecarga) · un layout por Record Type (sobrescritura)",
    en: "“New contact” from the account or from the tab (overloading) · a layout per Record Type (overriding)",
  },
  objectives: [
    {
      es: "Escribir métodos sobrecargados y saber cómo elige Apex cuál ejecutar.",
      en: "Write overloaded methods and know how Apex picks which one to run.",
    },
    {
      es: "Distinguir sobrecarga de sobrescritura por dónde viven y cuándo se decide.",
      en: "Tell overloading from overriding by where they live and when the choice is made.",
    },
    {
      es: "Evitar duplicar lógica haciendo que una sobrecarga llame a otra.",
      en: "Avoid duplicating logic by having one overload call another.",
    },
  ],

  theory: [
    {
      type: "lead",
      text: {
        es: "Sobrecargar y sobrescribir suenan casi igual y se confunden en entrevistas, en exámenes y hasta en libros. No se parecen en nada: una va de parámetros dentro de una misma clase; la otra, de herencia entre clases.",
        en: "Overloading and overriding sound almost the same and get mixed up in interviews, in exams and even in books. They are nothing alike: one is about parameters within a single class; the other, about inheritance between classes.",
      },
    },
    {
      type: "callout",
      variant: "admin",
      title: { es: "El paralelo de Admin", en: "The Admin parallel" },
      text: {
        es: "«Nuevo contacto» existe desde la pestaña Contactos (llegas sin datos) y desde la related list de una cuenta (llegas con la cuenta ya puesta): la misma acción, distintas entradas. Eso es sobrecarga. En cambio, cuando un Record Type sustituye el page layout por defecto por uno propio, el registro «hace lo mismo a su manera». Eso es sobrescritura.",
        en: "“New contact” exists from the Contacts tab (you arrive with no data) and from an account's related list (you arrive with the account already set): the same action, different inputs. That is overloading. By contrast, when a Record Type replaces the default page layout with its own, the record “does the same thing its own way”. That is overriding.",
      },
    },
    {
      type: "h",
      text: { es: "Sobrecarga: mismo nombre, distintos parámetros", en: "Overloading: same name, different parameters" },
    },
    {
      type: "p",
      text: {
        es: "Una clase puede tener varios métodos con el mismo nombre si sus parámetros son distintos en número o en tipo. Apex elige cuál ejecutar mirando los argumentos que pasas, y lo decide al compilar. Ya lo has usado: String.valueOf(42) y String.valueOf(Date.today()) son métodos distintos con el mismo nombre, y también tus dos constructores de SupportPlan.",
        en: "A class can have several methods with the same name if their parameters differ in number or type. Apex chooses which to run by looking at the arguments you pass, and decides at compile time. You have used it already: String.valueOf(42) and String.valueOf(Date.today()) are different methods with the same name, and so are your two SupportPlan constructors.",
      },
    },
    {
      type: "code",
      code: {
        es: `public class MoneyFormatter {
    public static String format(Decimal amount) {
        return format(amount, 'EUR');          // reutiliza la otra versión
    }

    public static String format(Decimal amount, String currencyCode) {
        return currencyCode + ' ' + amount;
    }
}

MoneyFormatter.format(1500);           // EUR 1500
MoneyFormatter.format(1500, 'USD');    // USD 1500`,
        en: `public class MoneyFormatter {
    public static String format(Decimal amount) {
        return format(amount, 'EUR');          // reuses the other version
    }

    public static String format(Decimal amount, String currencyCode) {
        return currencyCode + ' ' + amount;
    }
}

MoneyFormatter.format(1500);           // EUR 1500
MoneyFormatter.format(1500, 'USD');    // USD 1500`,
      },
      caption: {
        es: "La versión corta llama a la larga con un valor por defecto: la lógica vive en un único sitio, como con this(…) en los constructores.",
        en: "The short version calls the long one with a default value: the logic lives in one place, as with this(…) in constructors.",
      },
    },
    {
      type: "callout",
      variant: "warn",
      title: { es: "El tipo de retorno no cuenta", en: "The return type does not count" },
      text: {
        es: "Dos métodos que solo se diferencian en lo que devuelven no son una sobrecarga válida: Apex elige por los argumentos, y con los mismos argumentos no sabría cuál llamar. No compila.",
        en: "Two methods that differ only in what they return are not a valid overload: Apex chooses by the arguments, and with the same arguments it could not tell which to call. It does not compile.",
      },
    },
    {
      type: "h",
      text: { es: "Sobrescritura: la hija lo hace a su manera", en: "Overriding: the child does it its own way" },
    },
    {
      type: "p",
      text: {
        es: "Es lo que hiciste en la lección anterior: el padre ofrece un método virtual o abstract y la hija escribe el mismo método, con los mismos parámetros, marcado override. Aquí la decisión se toma al ejecutar: aunque la variable sea de tipo padre, se ejecuta la versión del objeto real.",
        en: "It is what you did last lesson: the parent offers a virtual or abstract method and the child writes the same method, with the same parameters, marked override. Here the decision is made at runtime: even if the variable is of the parent's type, the real object's version runs.",
      },
    },
    {
      type: "diagram",
      id: "m05-overload-override",
      caption: {
        es: "Sobrecarga: varias versiones una al lado de otra, en la misma clase. Sobrescritura: una versión encima de otra, en la jerarquía.",
        en: "Overloading: several versions side by side, in the same class. Overriding: one version on top of another, down the hierarchy.",
      },
    },
    {
      type: "table",
      head: [
        { es: "", en: "" },
        { es: "Sobrecarga", en: "Overloading" },
        { es: "Sobrescritura", en: "Overriding" },
      ],
      rows: [
        [
          { es: "¿Dónde?", en: "Where?" },
          { es: "En la misma clase", en: "In the same class" },
          { es: "Entre padre e hija", en: "Between parent and child" },
        ],
        [
          { es: "Parámetros", en: "Parameters" },
          { es: "Distintos", en: "Identical" },
          { es: "Idénticos", en: "Identical" },
        ],
        [
          { es: "Palabras clave", en: "Keywords" },
          { es: "Ninguna", en: "None" },
          { es: "virtual/abstract + override", en: "virtual/abstract + override" },
        ],
        [
          { es: "¿Cuándo se decide cuál se ejecuta?", en: "When is it decided which runs?" },
          { es: "Al compilar, por los argumentos", en: "At compile time, by the arguments" },
          { es: "Al ejecutar, por el objeto real", en: "At runtime, by the real object" },
        ],
      ],
    },
    {
      type: "callout",
      variant: "tip",
      title: { es: "📘 Del libro de Java a Apex", en: "📘 From the Java book to Apex" },
      text: {
        es: "El libro habla de tres tipos de polimorfismo y usa «sobrecarga» también para el operador + que suma números y une textos. Para Apex quédate con esta versión simple: sobrecarga = mismo nombre y distintos parámetros en una clase; sobrescritura = override en una hija. Además, la sobrecarga de operadores de C++ que menciona el libro no existe en Apex: no puedes redefinir qué hace + con tus clases.",
        en: "The book talks about three kinds of polymorphism and also uses “overloading” for the + operator that adds numbers and joins text. For Apex, keep this simple version: overloading = same name and different parameters in one class; overriding = override in a child. Also, the C++ operator overloading the book mentions does not exist in Apex: you cannot redefine what + does with your classes.",
      },
    },
    {
      type: "callout",
      variant: "recall",
      title: { es: "Antes de seguir", en: "Before moving on" },
      text: {
        es: "Sin mirar arriba: si te dicen «mismos parámetros, distinta clase», ¿de cuál se habla? ¿Y si te dicen «misma clase, distintos parámetros»?",
        en: "Without looking up: if you hear “same parameters, different class”, which one is it? And “same class, different parameters”?",
      },
    },
  ],

  quiz: [
    {
      id: "m05-l09-q1",
      kind: "single",
      prompt: {
        es: "Dentro de la clase Invoice hay total() y total(Decimal taxRate). ¿Qué es?",
        en: "Inside the Invoice class there are total() and total(Decimal taxRate). What is this?",
      },
      options: [
        { es: "Sobrecarga", en: "Overloading" },
        { es: "Sobrescritura", en: "Overriding" },
        { es: "Un error: no compila", en: "An error: it does not compile" },
      ],
      answer: 0,
      explain: {
        es: "Misma clase, mismo nombre, distintos parámetros: sobrecarga. No hace falta ninguna palabra clave.",
        en: "Same class, same name, different parameters: overloading. No keyword is needed.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l09-q2",
      kind: "single",
      prompt: {
        es: "¿Por qué no compila esta clase?",
        en: "Why does this class not compile?",
      },
      code: {
        es: `public class Converter {
    public Integer parse(String value) { return Integer.valueOf(value); }
    public Decimal parse(String value) { return Decimal.valueOf(value); }
}`,
        en: `public class Converter {
    public Integer parse(String value) { return Integer.valueOf(value); }
    public Decimal parse(String value) { return Decimal.valueOf(value); }
}`,
      },
      options: [
        {
          es: "Solo se diferencian en el tipo de retorno, y Apex elige por los parámetros.",
          en: "They only differ in return type, and Apex chooses by the parameters.",
        },
        {
          es: "Falta override en el segundo método.",
          en: "override is missing on the second method.",
        },
        {
          es: "Los métodos que convierten tipos tienen que ser static.",
          en: "Methods that convert types have to be static.",
        },
      ],
      answer: 0,
      explain: {
        es: "Con parse('42') Apex no sabría cuál llamar. Para una sobrecarga válida, cambia los parámetros o usa nombres distintos, como parseInteger y parseDecimal.",
        en: "With parse('42') Apex could not tell which to call. For a valid overload, change the parameters or use different names, like parseInteger and parseDecimal.",
      },
      tags: ["find-error", "spaced"],
      from: { es: "Repaso · M1 L9", en: "Review · M1 L9" },
    },
    {
      id: "m05-l09-q3",
      kind: "single",
      prompt: { es: "¿Qué muestra este código?", en: "What does this code print?" },
      code: {
        es: `public virtual class Report {
    public virtual String title() { return 'Informe'; }
}
public class SalesReport extends Report {
    public override String title() { return 'Informe de ventas'; }
}
Report r = new SalesReport();
System.debug(r.title());`,
        en: `public virtual class Report {
    public virtual String title() { return 'Report'; }
}
public class SalesReport extends Report {
    public override String title() { return 'Sales report'; }
}
Report r = new SalesReport();
System.debug(r.title());`,
      },
      options: [
        { es: "Informe de ventas / Sales report", en: "Sales report" },
        { es: "Informe / Report", en: "Report" },
        { es: "No compila: r es de tipo Report", en: "It does not compile: r is of type Report" },
      ],
      answer: 0,
      explain: {
        es: "En la sobrescritura manda el objeto real, no el tipo de la variable: r apunta a un SalesReport.",
        en: "With overriding, the real object rules, not the variable's type: r points to a SalesReport.",
      },
      tags: ["predict-output", "spaced"],
      from: { es: "Repaso · M5 L8", en: "Review · M5 L8" },
    },
    {
      id: "m05-l09-q4",
      kind: "multi",
      prompt: {
        es: "¿Cuáles de estos métodos de la plataforma son ejemplos de sobrecarga?",
        en: "Which of these platform methods are examples of overloading?",
      },
      options: [
        {
          es: "String.valueOf(Integer) y String.valueOf(Date)",
          en: "String.valueOf(Integer) and String.valueOf(Date)",
        },
        {
          es: "list.add(element) y list.add(index, element)",
          en: "list.add(element) and list.add(index, element)",
        },
        {
          es: "El toString() de una clase hija que sustituye al del padre",
          en: "A child class's toString() replacing the parent's",
        },
      ],
      answers: [0, 1],
      explain: {
        es: "Las dos primeras son el mismo nombre con distintos parámetros. La tercera es sobrescritura.",
        en: "The first two are the same name with different parameters. The third is overriding.",
      },
      tags: ["interleaving"],
    },
    {
      id: "m05-l09-q5",
      kind: "text",
      prompt: {
        es: "En la sobrescritura, ¿qué palabra clave escribe la clase hija?",
        en: "With overriding, which keyword does the child class write?",
      },
      accept: ["override"],
      placeholder: { es: "una palabra", en: "one word" },
      explain: {
        es: "override. La sobrecarga, en cambio, no lleva ninguna palabra clave.",
        en: "override. Overloading, by contrast, takes no keyword at all.",
      },
      tags: ["recall"],
    },
    {
      id: "m05-l09-q6",
      kind: "single",
      prompt: {
        es: "¿Qué muestra MoneyFormatter.format(20) con la clase de la teoría?",
        en: "What does MoneyFormatter.format(20) print with the class from the theory?",
      },
      options: [
        { es: "EUR 20", en: "EUR 20" },
        { es: "20", en: "20" },
        { es: "No compila: falta la divisa", en: "It does not compile: the currency is missing" },
      ],
      answer: 0,
      explain: {
        es: "Con un solo argumento, Apex elige la versión de un parámetro, que llama a la de dos con 'EUR'.",
        en: "With a single argument, Apex picks the one-parameter version, which calls the two-parameter one with 'EUR'.",
      },
      tags: ["predict-output"],
    },
  ],

  exercise: {
    prompt: {
      es: "Finanzas quiere dos cosas: una forma única de formatear importes, con divisa opcional; y que cada tipo de informe tenga su propio título, partiendo de uno genérico.",
      en: "Finance wants two things: a single way to format amounts, with an optional currency; and for each kind of report to have its own title, starting from a generic one.",
    },
    brief: [
      {
        es: "Clase MoneyFormatter con dos métodos estáticos format: uno recibe solo el importe y otro el importe y la divisa. El de un parámetro llama al de dos con 'EUR'. Devuelven divisa + ' ' + importe.",
        en: "Class MoneyFormatter with two static format methods: one takes only the amount and the other the amount and the currency. The one-parameter version calls the two-parameter one with 'EUR'. They return currency + ' ' + amount.",
      },
      {
        es: "Clase Report que se pueda heredar, con un método title() que las hijas puedan cambiar y que devuelva el título genérico.",
        en: "Class Report that can be inherited from, with a title() method children may change, returning the generic title.",
      },
      {
        es: "Clase SalesReport que herede de Report y sustituya title().",
        en: "Class SalesReport inheriting from Report and replacing title().",
      },
      {
        es: "Debajo: formatea 1500 con las dos versiones y guarda el título de un SalesReport en una variable de tipo Report.",
        en: "Below: format 1500 with both versions and store a SalesReport's title using a Report-typed variable.",
      },
    ],
    starter: {
      es: `// 1. MoneyFormatter (sobrecarga).


// 2. Report y SalesReport (sobrescritura).


// 3. Uso.
`,
      en: `// 1. MoneyFormatter (overloading).


// 2. Report and SalesReport (overriding).


// 3. Usage.
`,
    },
    hints: [
      {
        es: "Son dos ejercicios en uno. En el primero, los dos métodos se llaman igual y viven en la misma clase. En el segundo, el método se llama igual en dos clases distintas y hacen falta dos palabras clave.",
        en: "It is two exercises in one. In the first, both methods share a name and live in the same class. In the second, the method shares a name across two classes and two keywords are needed.",
      },
      {
        es: "format(Decimal amount) { return format(amount, 'EUR'); } — public virtual class Report { public virtual String title() { … } } — public class SalesReport extends Report { public override String title() { … } }",
        en: "format(Decimal amount) { return format(amount, 'EUR'); } — public virtual class Report { public virtual String title() { … } } — public class SalesReport extends Report { public override String title() { … } }",
      },
      {
        es: "Pseudocódigo del uso: String eur = MoneyFormatter.format(1500); String usd = MoneyFormatter.format(1500, 'USD'); Report r = new SalesReport(); String reportTitle = r.title();",
        en: "Usage pseudocode: String eur = MoneyFormatter.format(1500); String usd = MoneyFormatter.format(1500, 'USD'); Report r = new SalesReport(); String reportTitle = r.title();",
      },
    ],
    solution: {
      es: `public class MoneyFormatter {
    public static String format(Decimal amount) {
        return format(amount, 'EUR');
    }

    public static String format(Decimal amount, String currencyCode) {
        return currencyCode + ' ' + amount;
    }
}

public virtual class Report {
    public virtual String title() {
        return 'Informe';
    }
}

public class SalesReport extends Report {
    public override String title() {
        return 'Informe de ventas';
    }
}

// Uso
String eur = MoneyFormatter.format(1500);          // EUR 1500
String usd = MoneyFormatter.format(1500, 'USD');   // USD 1500
Report monthly = new SalesReport();
String reportTitle = monthly.title();              // Informe de ventas`,
      en: `public class MoneyFormatter {
    public static String format(Decimal amount) {
        return format(amount, 'EUR');
    }

    public static String format(Decimal amount, String currencyCode) {
        return currencyCode + ' ' + amount;
    }
}

public virtual class Report {
    public virtual String title() {
        return 'Report';
    }
}

public class SalesReport extends Report {
    public override String title() {
        return 'Sales report';
    }
}

// Usage
String eur = MoneyFormatter.format(1500);          // EUR 1500
String usd = MoneyFormatter.format(1500, 'USD');   // USD 1500
Report monthly = new SalesReport();
String reportTitle = monthly.title();              // Sales report`,
    },
    checks: [
      {
        id: "m05-l09-c1",
        label: {
          es: "MoneyFormatter tiene dos format estáticos con distintos parámetros",
          en: "MoneyFormatter has two static format methods with different parameters",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+MoneyFormatter\\s*\\{" },
            { op: "match", pattern: "public\\s+static\\s+String\\s+format\\s*\\(\\s*Decimal\\s+\\w+\\s*\\)" },
            {
              op: "match",
              pattern: "public\\s+static\\s+String\\s+format\\s*\\(\\s*Decimal\\s+\\w+\\s*,\\s*String\\s+\\w+\\s*\\)",
            },
          ],
        },
        onFail: {
          es: "Dos métodos con el mismo nombre: format(Decimal amount) y format(Decimal amount, String currencyCode), los dos public static String.",
          en: "Two methods with the same name: format(Decimal amount) and format(Decimal amount, String currencyCode), both public static String.",
        },
      },
      {
        id: "m05-l09-c2",
        label: {
          es: "La versión corta reutiliza la larga con 'EUR'",
          en: "The short version reuses the long one with 'EUR'",
        },
        rule: { op: "match", pattern: "return\\s+format\\(\\s*\\w+\\s*,\\s*'EUR'\\s*\\)\\s*;" },
        onFail: {
          es: "Sin duplicar lógica: dentro de format(Decimal amount), return format(amount, 'EUR');",
          en: "No duplicated logic: inside format(Decimal amount), return format(amount, 'EUR');",
        },
        onPass: {
          es: "Si Finanzas cambia el formato, se toca un método y las dos versiones lo recogen.",
          en: "If Finance changes the format, one method is touched and both versions pick it up.",
        },
      },
      {
        id: "m05-l09-c3",
        label: {
          es: "Report es virtual y su title() también",
          en: "Report is virtual and so is its title()",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+virtual\\s+class\\s+Report\\s*\\{" },
            { op: "match", pattern: "public\\s+virtual\\s+String\\s+title\\s*\\(\\s*\\)\\s*\\{" },
          ],
        },
        onFail: {
          es: "Para que una hija pueda cambiarlo: public virtual class Report { public virtual String title() { … } }",
          en: "For a child to be able to change it: public virtual class Report { public virtual String title() { … } }",
        },
      },
      {
        id: "m05-l09-c4",
        label: {
          es: "SalesReport hereda y sustituye title() con override",
          en: "SalesReport inherits and replaces title() with override",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "public\\s+class\\s+SalesReport\\s+extends\\s+Report\\s*\\{" },
            { op: "match", pattern: "public\\s+override\\s+String\\s+title\\s*\\(\\s*\\)\\s*\\{" },
          ],
        },
        onFail: {
          es: "public class SalesReport extends Report { public override String title() { … } } — mismos parámetros (ninguno) y override.",
          en: "public class SalesReport extends Report { public override String title() { … } } — same parameters (none) and override.",
        },
      },
      {
        id: "m05-l09-c5",
        label: {
          es: "El uso llama a las dos sobrecargas y lee el título a través de una variable Report",
          en: "The usage calls both overloads and reads the title through a Report variable",
        },
        rule: {
          op: "all",
          of: [
            { op: "match", pattern: "MoneyFormatter\\.format\\(\\s*1500\\s*\\)" },
            { op: "match", pattern: "MoneyFormatter\\.format\\(\\s*1500\\s*,\\s*'[A-Z]{3}'\\s*\\)" },
            { op: "match", pattern: "Report\\s+\\w+\\s*=\\s*new\\s+SalesReport\\s*\\(\\s*\\)" },
            { op: "match", pattern: "\\w+\\.title\\(\\s*\\)" },
          ],
        },
        onFail: {
          es: "MoneyFormatter.format(1500) y MoneyFormatter.format(1500, 'USD'); después Report r = new SalesReport(); y r.title().",
          en: "MoneyFormatter.format(1500) and MoneyFormatter.format(1500, 'USD'); then Report r = new SalesReport(); and r.title().",
        },
      },
    ],
    rubric: [
      {
        es: "Explica con tus palabras por qué r.title() devuelve el título de ventas aunque r sea de tipo Report.",
        en: "Explain in your own words why r.title() returns the sales title even though r is of type Report.",
      },
    ],
  },
};
