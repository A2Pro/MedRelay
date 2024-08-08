const Footer = () => {
    return (
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-8 lg:space-y-0">
            {/* Logo and Description */}
            <div className="flex-1 text-center lg:text-left">
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                MedRelay™ - Ahead of Emergency™
              </span>
              <p className="mt-4 text-sm">
                Connecting ambulances with hospitals in real-time to enhance emergency medical response.
              </p>
            </div>
  
            {/* Navigation Links */}
            <div className="flex-1">
              <nav className="flex flex-col lg:flex-row justify-center lg:justify-end space-y-4 lg:space-y-0 lg:space-x-8">
                <a href="#" className="text-sm hover:underline">Home</a>
                <a href="#" className="text-sm hover:underline">Features</a>
                <a href="#" className="text-sm hover:underline">Testimonials</a>
                <a href="#" className="text-sm hover:underline">FAQ</a>
                <a href="#" className="text-sm hover:underline">Contact Us</a>
              </nav>
            </div>
          </div>
  
          {/* Social Media and Contact Information */}
          <div className="flex flex-col lg:flex-row justify-between items-center mt-8 space-y-4 lg:space-y-0">
            <div className="flex space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6 text-blue-500 hover:text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.495v-9.294H9.691v-3.622h3.13V8.411c0-3.1 1.894-4.788 4.66-4.788 1.325 0 2.463.098 2.795.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.762v2.312h3.587l-.467 3.622h-3.12V24h6.116c.729 0 1.326-.597 1.326-1.326V1.326C24 .597 23.403 0 22.675 0z" />
                </svg>
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6 text-blue-400 hover:text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557a9.837 9.837 0 0 1-2.828.775A4.92 4.92 0 0 0 23.337 3.1a9.867 9.867 0 0 1-3.127 1.195A4.917 4.917 0 0 0 16.616 2c-2.7 0-4.894 2.191-4.894 4.895 0 .383.042.76.125 1.12C7.688 7.824 4.064 5.962 1.64 3.161a4.886 4.886 0 0 0-.661 2.465c0 1.7.869 3.197 2.19 4.075a4.92 4.92 0 0 1-2.218-.616c-.054 1.896 1.348 3.68 3.317 4.072a4.952 4.952 0 0 1-2.212.084c.623 1.941 2.431 3.355 4.577 3.396A9.867 9.867 0 0 1 0 19.54a13.874 13.874 0 0 0 7.548 2.209c9.142 0 14.147-7.72 14.147-14.417 0-.22-.005-.437-.014-.652A10.146 10.146 0 0 0 24 4.557z" />
                </svg>
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6 text-blue-700 hover:text-blue-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.23 0H1.77C.792 0 0 .77 0 1.74v20.52C0 23.23.792 24 1.77 24h20.46c.978 0 1.77-.77 1.77-1.74V1.74C24 .77 23.208 0 22.23 0zM7.081 20.454H3.577V9.036h3.504v11.418zM5.329 7.697c-1.111 0-2.013-.902-2.013-2.013 0-1.112.902-2.014 2.013-2.014 1.111 0 2.013.902 2.013 2.014 0 1.111-.902 2.013-2.013 2.013zm15.127 12.757h-3.504V15.72c0-1.129-.021-2.585-1.575-2.585-1.577 0-1.82 1.23-1.82 2.501v4.818h-3.504V9.036h3.364v1.55h.049c.467-.887 1.607-1.821 3.308-1.821 3.536 0 4.186 2.327 4.186 5.354v6.335z" />
                </svg>
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <svg className="h-6 w-6 text-pink-500 hover:text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5C19.45 2 21 3.55 21 5.25v8.5c0 1.7-1.55 3.25-3.25 3.25h-8.5C5.55 17 4 15.45 4 13.75v-8.5C4 3.55 5.55 2 7.75 2zm5.7 6.85a4.85 4.85 0 1 0 0 9.7 4.85 4.85 0 0 0 0-9.7zm0 7.7a2.85 2.85 0 1 1 0-5.7 2.85 2.85 0 0 1 0 5.7zM19 6.6c0 .85-.7 1.55-1.55 1.55-.85 0-1.55-.7-1.55-1.55 0-.85.7-1.55 1.55-1.55.85 0 1.55.7 1.55 1.55zM12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0z" />
                </svg>
              </a>
            </div>
  
            {/* Contact Information */}
            <div className="flex flex-col text-center lg:text-right">
              <p className="text-sm">Email: contact@medrelay.com</p>
              <p className="text-sm">Phone: +1 (555) 123-4567</p>
              <p className="text-sm">Address: 123 MedRelay Lane, Cupertino, CA</p>
            </div>
          </div>
  
          {/* Copyright */}
          <div className="mt-8 border-t border-gray-700 pt-6 text-center">
            <p className="text-sm">
              © {new Date().getFullYear()} MedRelay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  