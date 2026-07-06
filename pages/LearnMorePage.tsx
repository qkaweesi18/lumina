import React from 'react';
import { Link } from 'react-router-dom';
import {
  Leaf, Recycle, Heart, Shield, Truck, Clock,
  Award, Star, CheckCircle, ArrowRight, Sparkles
} from 'lucide-react';

export const LearnMorePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm mb-6 border border-white/20">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-gray-200">Our Story</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Refined Essentials for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Modern Living
              </span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              At Lumina, we believe thatless is more. Every product we curate is chosen for its 
              quality, functionality, and timeless design. We're not just selling products — 
              we're offering a lifestyle of intentional simplicity.
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Our Mission
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            We started Lumina with a simple idea: life doesn't need to be complicated. 
            In a world full of excess, we chose to focus on what truly matters — 
            quality craftsmanship, thoughtful design, and lasting value.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Every product in our collection has been carefully selected and tested to 
            meet our high standards. We work directly with artisans and manufacturers 
            who share our commitment to excellence.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Handpicked Quality</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Sustainable Materials</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Ethical Production</span>
                </div>
              </div>
        </div>
      </section>

      {/* Divider Banner */}
      <section className="relative h-48 sm:h-64 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80" 
          alt="Library with warm sunlight"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-white text-lg sm:text-xl md:text-2xl font-light italic max-w-2xl">
              "Quality is not an act, it is a habit."
            </p>
            <p className="text-gray-300 text-sm mt-3">— Aristotle</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our values guide everything we do — from product selection to customer service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-6 h-6" />,
                title: 'Sustainability',
                description: 'We prioritize eco-friendly materials and sustainable practices in everything we create.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: <Award className="w-6 h-6" />,
                title: 'Quality',
                description: 'Every product meets our rigorous standards for craftsmanship and durability.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: <Heart className="w-6 h-6" />,
                title: 'Community',
                description: 'We support local artisans and give back to the communities we serve.',
                color: 'bg-pink-100 text-pink-600'
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: 'Trust',
                description: 'Transparent pricing, honest descriptions, and a satisfaction guarantee.',
                color: 'bg-purple-100 text-purple-600'
              }
            ].map((value, index) => (
              <div key={index} className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-14 h-14 ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              From browsing to delivery, we've made the experience seamless.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: <Star className="w-6 h-6" />,
                title: 'Browse & Discover',
                description: 'Explore our curated collection of minimalist essentials. Filter by category, search for specifics, or just enjoy the discovery.'
              },
              {
                step: '02',
                icon: <Truck className="w-6 h-6" />,
                title: 'Order & Pay',
                description: 'Add items to your cart, choose your payment method — bank transfer or PayFast — and complete your order in seconds.'
              },
              {
                step: '03',
                icon: <Clock className="w-6 h-6" />,
                title: 'Receive & Enjoy',
                description: 'We ship worldwide with care. Track your order, receive it in premium packaging, and enjoy products built to last.'
              }
            ].map((item, index) => (
              <div key={index} className="relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="text-6xl font-extrabold text-white/10 absolute top-4 right-6">
                  {item.step}
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-lg">
              Real reviews from people who love Lumina products.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                role: 'Interior Designer',
                quote: 'The Ceramic Pour-Over Set is absolutely stunning. The quality is exceptional and it looks beautiful on my kitchen counter.',
                rating: 5
              },
              {
                name: 'James K.',
                role: 'Minimalist Enthusiast',
                quote: 'Finally, a store that gets it. Every product I\'ve bought from Lumina has been exactly what I needed — no more, no less.',
                rating: 5
              },
              {
                name: 'Priya R.',
                role: 'Art Director',
                quote: 'The attention to detail in the packaging alone tells you this brand cares. The products themselves are even better.',
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{review.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.name}</p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Simplify Your Life?
          </h2>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of people who have chosen quality over quantity. 
            Explore our collection and find pieces that speak to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all shadow-lg"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              View Collection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
