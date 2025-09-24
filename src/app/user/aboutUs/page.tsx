"use client";
import React from "react";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="min-h-screen p-4 flex flex-col items-center">
      <div className="max-w-4xl bg-white shadow-md rounded-lg p-8 flex flex-col items-center gap-6">
        {/* Image at the top */}
        <div className="w-full flex justify-center">
          <Image
            src="/images/logo.png" // Put your image in public/images folder
            alt="About Us"
            width={400}
            height={350}
            className="rounded-lg object-cover w-full h-[300px]"
          />
        </div>

        {/* Text content */}
        <h1 className="text-3xl font-bold mb-4 text-gray-900">About Us</h1>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Welcome to Our E-commerce Store! We are passionate about providing the
          best online shopping experience for our customers. Our mission is to
          offer high-quality products at competitive prices with exceptional
          customer service.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          We believe in creating a seamless and enjoyable shopping journey. Our
          dedicated team carefully selects products to ensure they meet our
          quality standards. Whether you are looking for the latest fashion
          trends, electronics, or home essentials, we’ve got you covered.
        </p>
        <p className="text-gray-700 mb-4 leading-relaxed">
          Thank you for choosing us as your trusted online store. We value your
          support and look forward to serving you!
        </p>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Our Vision
          </h2>
          <p className="text-gray-700 leading-relaxed">
            To be the most customer-centric online store where customers can
            find anything they want at the best prices.
          </p>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            Our Values
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Quality and Trust</li>
            <li>Customer Satisfaction</li>
            <li>Innovation and Creativity</li>
            <li>Integrity and Transparency</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
