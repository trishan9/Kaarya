import { useEffect, useState } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";
import { Container } from "./Container";
import screenshotWorkspace from "@/assets/marketing/home.png";
import screenshotConnect from "@/assets/marketing/connect.png";
import screenshotProjects from "@/assets/marketing/projects.png";
import screenshotKanban from "@/assets/marketing/task.png";

const features = [
  {
    title: "Workspace",
    description:
      "Set up dedicated workspaces for teams, each fully customizable to reflect unique project requirements and branding.",
    image: screenshotWorkspace,
  },
  {
    title: "Tasks with Kanban View",
    description:
      "Organize and monitor tasks using a sleek Kanban board, allowing seamless intuitive drag-and-drop updates and real-time collaboration for progress tracking.",
    image: screenshotKanban,
  },
  {
    title: "Connect (Chat & Huddle)",
    description:
      "Seamlessly connect with team members through integrated chat and video calls, supporting group discussions, file sharing, and access to virtual meeting rooms for collaboration.",
    image: screenshotConnect,
  },
  {
    title: "Projects Page",
    description:
      "View all ongoing projects on a comprehensive dashboard, complete with progress summaries, team assignments, deadlines, and efficient milestone tracking.",
    image: screenshotProjects,
  },
];


export function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState<
    "horizontal" | "vertical"
  >("horizontal");

  useEffect(() => {
    const lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id="features"
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-gradient-to-r to-green-400 from-primaryGreen pb-28 pt-20 sm:py-32"
    >
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-medium text-3xl text-white sm:text-4xl md:text-5xl">
            Everything You Need for Agile Project Success.
          </h2>

          <p className="mt-6 text-lg tracking-tight text-green-100">
            Well, Everything You Need If You’re Not Too Fussy About Complex
            Workflows.
          </p>
        </div>

        <TabGroup
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                        selectedIndex === featureIndex
                          ? "bg-white lg:bg-white/15 lg:ring-1 lg:ring-inset lg:ring-white/15"
                          : "hover:bg-white/15 lg:hover:bg-white/5",
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            "font-medium text-lg ui-not-focus-visible:outline-none",
                            selectedIndex === featureIndex
                              ? "text-green-600 lg:text-white"
                              : "text-green-100 hover:text-white lg:text-white",
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>

                      <p
                        className={clsx(
                          "mt-2 hidden text-sm lg:text-[15px] lg:block",
                          selectedIndex === featureIndex
                            ? "text-white"
                            : "text-green-100 group-hover:text-white",
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>

              <TabPanels className="lg:col-span-7">
                {features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />

                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>

                    <div className="mt-10 w-[45rem] overflow-hidden rounded-xl bg-slate-50 shadow-xl shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem]">
                      <img
                        className="w-full"
                        src={feature.image}
                        alt=""
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  );
}
