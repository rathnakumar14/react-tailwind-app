const About = () => {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold">About Page</h1>
<img
  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee"
  alt="React Development"
  className="mx-auto rounded-lg shadow-lg w-80 mt-6"
/>

      <p className="text-gray-600 max-w-2x2 mx-auto">
        This project demonstrates how to implement routing in a React application
        using React Router. The application is divided into multiple pages such
        as Home, Cards, and About. Users can navigate between these pages using
        the navigation menu without refreshing the browser.
      </p>

      <p className="text-gray-600 mt-4 max-w-2x2 mx-auto">
        The interface is styled using Tailwind CSS to maintain a clean and
        responsive design. The Cards page allows users to add and search cards,
        while the Home page provides an introduction to the application.
      </p>
      
    </div>
  );
};

export default About;