const steps = [
  {
    number: "01",
    title: "Set up your payment",
    description:
      "sync calendars, control staff permissions, and work on the go with our mobile app.",
  },
  {
    number: "02",
    title: "Accept online payments",
    description:
      "using trusted payment processors, invoices, and multiple payment options like tips and deposits.",
  },
  {
    number: "03",
    title: "Increase revenue",
    description:
      "with gift certificates, packages, memberships, or group classes. Upsell with add-ons.",
  },
  {
    number: "04",
    title: "Feel confident",
    description:
      "knowing client information is private with built-in HIPAA compliance.",
  },
  {
    number: "05",
    title: "Reduce no-shows",
    description:
      "by sending automated email or SMS notifications and vaulting credit cards to enforce late fees.",
  },
  {
    number: "06",
    title: "Impress clients",
    description:
      "by offering virtual appointments. Send personalized intake forms and store client details.",
  },
  {
    number: "07",
    title: "Get booked",
    description:
      "through social media, email, or your website. Build a beautiful web presence with Squarespace.",
  },
  {
    number: "08",
    title: "Customize everything",
    description:
      "to match your brand experience and limit how and when clients book.",
  },
];

export default function HowScan2PayWorks() {
  return (
    <section className="w-full px-6 sm:px-12 lg:px-20">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
        How Scan2Pay works
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col gap-2">
            <span className="text-gray-400 text-base font-normal">
              {step.number}
            </span>
            <div>
              <p className="text-gray-900 text-sm font-semibold">
                {step.title}
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mt-0.5">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}