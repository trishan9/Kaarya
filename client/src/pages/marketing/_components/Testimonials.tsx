import { Container } from './Container'
import avatarImage1 from '@/assets/marketing/avatars/avatar-1.png'
import avatarImage2 from '@/assets/marketing/avatars/avatar-2.png'
import avatarImage3 from '@/assets/marketing/avatars/avatar-3.png'
import avatarImage4 from '@/assets/marketing/avatars/avatar-4.png'
import avatarImage5 from '@/assets/marketing/avatars/avatar-5.png'

const testimonials = [
  [
    {
      content:
        'Kaarya makes project management so simple that I sometimes wonder if I’m skipping steps. Turns out, I’m just not overwhelmed anymore!',
      author: {
        name: 'Nischay Maharjan',
        role: 'CTO at BrightSpark Ltd.',
        image: avatarImage1,
      },
    },
    {
      content:
        'I asked Kaarya support if they could make my team deliver faster. They told me they can streamline processes, but apparently "magic wands aren’t included."',
      author: {
        name: 'Trishan Wagle',
        role: 'CEO at TechWave Solutions',
        image: avatarImage4,
      },
    },
  ],
  [
    {
      content:
        'I love how Kaarya simplifies Agile workflows. My only issue is now my team expects me to be this organized in all areas of life!. I recommend Kaarya to all other inviduals like me!',
      author: {
        name: 'Sushant Babu',
        role: 'Scrum Master at Vertex Innovations',
        image: avatarImage5,
      },
    },
    {
      content:
        'We switched to Kaarya because our old tools were too clunky. Now, I actually enjoy managing projects—who knew that was possible?',
      author: {
        name: 'Bibek Pandey',
        role: 'Operations Lead at Nova Enterprises',
        image: avatarImage2,
      },
    },
  ],
  [
    {
      content:
        'Kaarya’s automation features saved us hours every week. I just hope my boss doesn’t find out I’m using that extra time to plan vacations.',
      author: {
        name: 'Abiral Shrestha',
        role: 'Project Coordinator at Dynamic Ventures',
        image: avatarImage3,
      },
    },
    {
      content:
        'I’ve sent two feature requests to Kaarya support, and both times they responded with "great idea!" Honestly, I’m flattered they’re listening to me.',
      author: {
        name: 'Albert Maharjan',
        role: 'Team Lead at AgileWorks',
        image: avatarImage4,
      },
    },
  ],
];


function QuoteIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" width={105} height={78} {...props}>
      <path d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z" />
    </svg>
  )
}

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-label="What our customers are saying"
      className="bg-slate-50 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-medium text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Loved by businesses worldwide.
          </h2>

          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Our software is so simple that people can’t help but fall in love
            with it. Simplicity is easy when you just skip tons of
            mission-critical features.
          </p>
        </div>
        
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {testimonials.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-6 sm:gap-y-8">
                {column.map((testimonial, testimonialIndex) => (
                  <li key={testimonialIndex}>
                    <figure className="relative rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10">
                      <QuoteIcon className="absolute left-6 top-6 fill-slate-100" />

                      <blockquote className="relative">
                        <p className="text-lg tracking-tight text-slate-900">
                          {testimonial.content}
                        </p>
                      </blockquote>

                      <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                        <div>
                          <div className="font-medium text-base text-slate-900">
                            {testimonial.author.name}
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {testimonial.author.role}
                          </div>
                        </div>

                        <div className="overflow-hidden rounded-full bg-slate-50">
                          <img
                            className="h-14 w-14 object-cover"
                            src={testimonial.author.image}
                            alt=""
                            width={56}
                            height={56}
                          />
                        </div>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
