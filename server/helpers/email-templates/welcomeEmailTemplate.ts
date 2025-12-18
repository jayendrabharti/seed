import sendMail from '../sendMail';

const welcomeEmailTemplate = ({ to }: { to: string }) => {
  const frontendUrl = process.env.FRONTEND_URL;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to SEED</title>
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    </head>
    <body class="m-0 p-0 bg-neutral-50">
      <div class="max-w-lg mx-auto my-12 px-4">
        <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div class="px-8 pt-8 pb-6">
            <div class="mb-6">
              <div class="text-2xl font-bold text-neutral-900 mb-3 text-center">SEED</div>
              <h1 class="text-xl font-semibold text-neutral-900 m-0">Welcome to SEED! 🌱</h1>
              <p class="text-sm text-neutral-600 mt-2 m-0">
                We're excited to have you on board
              </p>
            </div>

            <div class="border-t border-neutral-200 pt-6">
              <p class="text-sm text-neutral-700 m-0 mb-6">
                Hi there! Your account has been successfully created and you're all set to get started with SEED.
              </p>

              <div class="bg-neutral-50 border border-neutral-200 rounded-md p-6 mb-6">
                <h2 class="text-sm font-semibold text-neutral-900 m-0 mb-3">What's next?</h2>
                <ul class="text-sm text-neutral-700 m-0 pl-5 space-y-2">
                  <li>Complete your profile to personalize your experience</li>
                  <li>Explore the dashboard and discover features</li>
                  <li>Create your first business to start managing inventory</li>
                  <li>Check out our help center if you need guidance</li>
                </ul>
              </div>

              <a 
                href="${frontendUrl}/dashboard" 
                class="block w-full text-center bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium py-2.5 px-4 rounded-md no-underline transition-colors"
              >
                Get Started
              </a>

              <div class="mt-6 pt-6 border-t border-neutral-200">
                <p class="text-xs text-neutral-500 m-0">
                  Need help getting started? Visit our 
                  <a href="${frontendUrl}/support" target="_blank" class="text-neutral-900 underline">support center</a> 
                  or reply to this email with any questions.
                </p>
              </div>
            </div>
          </div>

          <div class="bg-neutral-50 px-8 py-4 border-t border-neutral-200">
            <div class="flex items-center justify-between text-xs text-neutral-500">
              <span>© ${new Date().getFullYear()} Seed</span>
              <div class="space-x-3">
                <a href="${frontendUrl}" target="_blank" class="text-neutral-600 hover:text-neutral-900 no-underline">Home</a>
                <a href="${frontendUrl}/support" target="_blank" class="text-neutral-600 hover:text-neutral-900 no-underline">Support</a>
              </div>
            </div>
          </div>
        </div>

        <p class="text-center text-xs text-neutral-400 mt-6">
          This email was sent to ${to}
        </p>
      </div>
    </body>
    </html>
  `;
};

export const sendWelcomeEmail = async (to: string) => {
  await sendMail({
    to,
    subject: 'Welcome to SEED',
    content: welcomeEmailTemplate({ to }),
  });
};

export default welcomeEmailTemplate;
