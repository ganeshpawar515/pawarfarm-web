function About() {

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow-md space-y-6">
      <h1 className="text-3xl font-bold mb-4">About This App</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">Demo Credentials</h2>
        <p className="mb-2">Use the following credentials to explore the app:</p>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Customer</strong>
            <br />
            Email: <code>second@gmail.com</code> <br />
            Password: <code>second</code>
          </li>
          <li>
            <strong>Staff</strong>
            <br />
            Email: <code>staff@gmail.com</code> <br />
            Password: <code>staffuser</code>
          </li>
          <li>
            <strong>Delivery Driver</strong>
            <br />
            Email: <code>delivery@gmail.com</code> <br />
            Password: <code>deliveryboy</code>
          </li>
        </ul>
        <p className="mt-4 text-gray-600 italic">
          Or you can register using your own Gmail account. Just verify the OTP sent to your
          email.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Features</h2>
        <ul className="list-disc list-inside space-y-1 text-gray-700">
          <li>Login &amp; Register</li>
          <li>Multiple User Roles (Customer, Staff, Delivery)</li>
          <li>Product Browsing</li>
          <li>Order Management: Customers can place orders</li>
          <li>Staff can change order status and assign delivery personnel</li>
          <li>Delivery drivers can update delivery status</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-gray-700 space-y-2">
          <span>✉️{" "}
            <a
              href="mailto:ganeshp.py07@gmail.com"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              ganeshp.py07@gmail.com
            </a>
          </span>
          <br />
          <span>🔗{" "}
            <a
              href="https://www.linkedin.com/in/ganesh-pawar-36b61824a"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn Profile
            </a>
          </span>
          <br />
          <span>💻{" "}
            <a
              href="https://github.com/ganeshpawar515"
              className="text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Profile
            </a>
          </span>
        </p>
      </section>

      <p className="mt-6 font-semibold text-blue-600">
        Improvement of app is ongoing — Last updated: 02-07-2025
      </p>

    </div>
  );
}

export default About;
