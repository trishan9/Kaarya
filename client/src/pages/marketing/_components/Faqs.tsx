import { Container } from "./Container";
import backgroundImage from "@/assets/LandingPage/background-faqs.jpg";

const faqs = [
  [
    {
      question: "Does Kaarya work for remote teams?",
      answer:
        "Absolutely, as long as your remote team has Wi-Fi and isn’t on a month-long silent retreat.",
    },
    {
      question: "Can I integrate Kaarya with other tools?",
      answer:
        "Of course! We love being friends with other apps—just don’t expect us to do all the heavy lifting.",
    },
    {
      question: "How do I sign up for Kaarya?",
      answer:
        'Click the big, shiny "Sign Up" button. If that’s too hard, Agile might not be for you.',
    },
  ],
  [
    {
      question: "What makes Kaarya different from Jira or Trello?",
      answer:
        "We’re like them, but cooler, simpler, and with fewer headaches. Think Agile without the drama.",
    },
    {
      question: "Do you offer support for Agile coaching?",
      answer:
        'Sure, but only if you promise to stop calling Scrum a "fancy meeting schedule."',
    },
    {
      question: "Is Kaarya really free to use?",
      answer:
        "Free as a bird! Until you want premium features—then we’re free… to take your money.",
    },
  ],
  [
    {
      question: "Can I manage multiple projects in Kaarya?",
      answer:
        "Yes, but we recommend not juggling too many if you’re new to Agile—chaos is not the goal here.",
    },
    {
      question: "Does Kaarya support Gantt charts?",
      answer:
        "We’d rather not, but fine—we’ll make them look less like a timeline of despair.",
    },
    {
      question: "What happens if I forget my login credentials?",
      answer:
        'Don’t worry! Just send us an email, and we’ll guide you through a fun game of "Password Treasure Hunt."',
    },
  ],
];

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <img
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
      />

      <Container className="relative">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faq-title"
            className="font-medium text-3xl tracking-tight text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>

          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, email our support team
            and if you’re lucky someone will get back to you.
          </p>
        </div>

        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="font-medium text-lg leading-7 text-slate-900">
                      {faq.question}
                    </h3>
                    
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
