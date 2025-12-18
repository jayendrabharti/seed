const otpEmailTemplate = ({
  otp,
  to,
  exp,
}: {
  otp: string;
  to: string;
  exp: Date;
}) => {
  const frontendUrl = process.env.FRONTEND_URL;

  // Format expiry date
  const formatExpiry = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const day = isToday ? 'Today' : date.getDate().toString().padStart(2, '0');
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const month = months[date.getMonth()];

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${day}${!isToday ? ' ' + month : ''} ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  const expiryFormatted = formatExpiry(exp);

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your OTP Code</title>
      <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
      <script>
        function copyOTP() {
          navigator.clipboard.writeText('${otp}').then(function() {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Copied!';
            btn.classList.add('bg-green-600');
            btn.classList.remove('bg-neutral-900', 'hover:bg-neutral-800');
            setTimeout(function() {
              btn.innerHTML = originalText;
              btn.classList.remove('bg-green-600');
              btn.classList.add('bg-neutral-900', 'hover:bg-neutral-800');
            }, 2000);
          });
        }
      </script>
    </head>
    <body class="m-0 p-0 bg-neutral-50">
      <div class="max-w-lg mx-auto my-12 px-4">
        <div class="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div class="px-8 pt-8 pb-6">
            <div class="mb-6">
              <div class="text-2xl font-bold text-neutral-900 mb-3 text-center">SEED</div>
              <h1 class="text-xl font-semibold text-neutral-900 m-0">Verify your email</h1>
              <p class="text-sm text-neutral-600 mt-2 m-0">
                A sign in attempt requires verification
              </p>
            </div>

            <div class="border-t border-neutral-200 pt-6">
              <p class="text-sm text-neutral-700 m-0 mb-6">
                Enter the following code to verify your account <span class="font-medium text-neutral-900">${to}</span>
              </p>

              <div class="bg-neutral-50 border border-neutral-200 rounded-md p-6 mb-6">
                <div class="text-center">
                  <div class="text-[32px] font-mono font-semibold text-neutral-900 tracking-[0.3em] select-all">${otp}</div>
                  <div class="text-xs text-neutral-500 mt-3">Expires ${expiryFormatted}</div>
                </div>
              </div>

              <button 
                id="copyBtn"
                onclick="copyOTP()" 
                class="block w-full text-center bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-medium py-2.5 px-4 rounded-md border-0 cursor-pointer transition-colors"
              >
                Copy OTP
              </button>

              <div class="mt-6 pt-6 border-t border-neutral-200">
                <p class="text-xs text-neutral-500 m-0">
                  If you didn't attempt to sign in but received this email, please ignore it or 
                  <a href="${frontendUrl}/support" target="_blank" class="text-neutral-900 underline">contact support</a> if you have concerns.
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

export default otpEmailTemplate;
