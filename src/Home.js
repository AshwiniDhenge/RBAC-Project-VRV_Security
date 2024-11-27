import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

function Home() {
    useEffect(() => {
        AOS.init();
    }, []);

    return (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 min-h-screen text-dark font-sans">

            <header className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-dark py-20">
               
             
                {/* <img src="/vrv.png" alt="VRV" /> */}
                <img
                    src="/vrv.png"
                    alt="VRV"
                    className="absolute bottom-0 left-0 w-full opacity-90"
                />


            </header>


            <section id="about" className="py-16 bg-gray-800">
                <div className="container mx-auto px-6 text-center">
                    {/* <h2 className="text-4xl font-bold text-yellow-500 mb-8">About Us</h2> */}

                    <motion.div
                    className="container mx-auto text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <h1 className="text-5xl font-extrabold mb-4">
                        VRV Security Services
                    </h1>
                    <p className="text-lg mb-8">
                        Trusted security solutions for homes and businesses.
                    </p>

                </motion.div>
                    <p className="text-lg leading-relaxed text-gray-300">
                        VRV Security Services is a leading provider of professional security solutions,
                        offering top-tier systems and monitoring services to ensure your home and business are safe.
                    </p>



                </div>
            </section>



            <footer className="bg-gray-900 text-dark py-6">
                <div className="container mx-auto text-center">
                    <div className="flex justify-center space-x-6 mb-4">
                        <FaFacebook size={24} className="hover:text-yellow-500 cursor-pointer" />
                        <FaTwitter size={24} className="hover:text-yellow-500 cursor-pointer" />
                        <FaLinkedin size={24} className="hover:text-yellow-500 cursor-pointer" />
                    </div>
                    <p>&copy; 2024 VRV Security Services. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
