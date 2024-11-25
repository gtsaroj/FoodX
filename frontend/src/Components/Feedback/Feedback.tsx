import image3 from "../../assets/image3.svg";
import { useFeedbackFn } from "../../Hooks/useFeedback";

const FeedbackForm = () => {
  const {
    feedback,
    feedbackType,
    mutate,
    rating,
    setFeedback,
    setFeedbackType,
    setRating,
  } = useFeedbackFn();

  return (
    <div className="w-full flex flex-col items-center justify-center gap-7 sm:gap-16">
      <div className="flex items-center w-full ">
        <h3 className="h-[1px] w-full sm:text-[22px] text-[16px]  bg-gradient-to-r from-black/100 dark:from-white/100  to-black/0 dark:to-white/0"></h3>
        <p className="font-semibold text-center sm:text-[22px] text-[12px] sm:min-w-[300px] w-[512px] tracking-wide text-[var(--dark-text)]">
          Share Your Experience
        </p>
        <h3 className="h-[1px] w-full  bg-gradient-to-r from-black/0 dark:from-white/0 to-black/100 dark:to-white/100"></h3>
      </div>
      <div className="w-full flex flex-row items-center justify-center lg:justify-between  p-4">
        <div className="w-full lg:flex hidden h-[530px]">
          <img className="w-full h-full" src={image3} alt="" />
        </div>
        <form
          onSubmit={mutate}
          className="w-full max-w-lg bg-[var(--light-foreground)]  shadow-lg rounded-lg p-6 space-y-3 sm:space-y-6"
        >
          <h1 className="sm:text-2xl text-[18px] font-bold text-gray-800 dark:text-white text-center">
            Your Opinion Matters!
          </h1>
          <p className="sm:text-sm text-xs text-gray-600 dark:text-gray-400 text-center">
            Help us improve by sharing your experience.
          </p>

          {/* Rating Section */}
          <div className="flex justify-center items-center gap-2">
            {[...Array(5)].map((_, index) => (
              <button
                type="button"
                key={index}
                className={`text-2xl ${
                  rating > index ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => setRating(index + 1)}
              >
                ★
              </button>
            ))}
          </div>

          {/* Feedback Type */}
          <div>
            <label
              htmlFor="type"
              className="block text-gray-700 dark:text-gray-300"
            >
              Feedback Type
            </label>
            <select required
              id="type"
              value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
              className="w-full mt-1 outline-none px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
              <option value="General Feedback">General Feedback</option>
            </select>
          </div>

          {/* Feedback Comment */}
          <div>
            <label
              htmlFor="feedback"
              className="block text-gray-700 dark:text-gray-300"
            >
              Your Feedback
            </label>
            <textarea required
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full outline-none mt-1 px-4 py-2 border rounded-md h-32 resize-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setRating(0);
                setFeedback("");
                setFeedbackType("");
              }}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[var(--primary-color)] hover:bg-[var(--primary-dark)] text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
