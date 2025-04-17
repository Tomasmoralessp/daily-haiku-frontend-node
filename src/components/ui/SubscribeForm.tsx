"use client";

const SubscribeForm = () => {
  return (
    <div className="mt-12 mb-2 text-center w-full max-w-md mx-auto">
      <p className="text-sm text-neutral-400 mb-3">
        Receive one haiku per day in your inbox. No noise, just poetry.
      </p>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/dailyhaiku"
        method="post"
        target="popupwindow"
        onSubmit={() =>
          window.open("https://buttondown.email/dailyhaiku", "popupwindow")
        }
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full"
      >
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="w-full sm:max-w-xs px-4 py-2 text-sm bg-transparent border-b border-neutral-500 placeholder-neutral-400 text-white focus:outline-none focus:border-white transition duration-200"
        />
        <input
          type="submit"
          value="Subscribe"
          className="w-full sm:w-auto px-4 py-2 text-sm text-white border border-white rounded hover:bg-white hover:text-black transition duration-200"
        />
      </form>
    </div>
  );
};

export default SubscribeForm;
