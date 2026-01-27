import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Award, Shield, Heart, Gem } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2070&auto=format&fit=crop" 
            alt="Aradhya Gems Workshop" 
            className="w-full h-full object-cover brightness-[0.5]"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4">
            Our Story
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Crafting timeless elegance since 1985
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif font-bold text-secondary mb-6">
                A Legacy of Excellence
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 1985 by master jeweller Rajan Aradhya, Aradhya Gems began as a small 
                  workshop in Mumbai, dedicated to creating exquisite pieces that tell stories 
                  through precious metals and gemstones.
                </p>
                <p>
                  Today, we continue that tradition with the same passion and attention to detail 
                  that defined our humble beginnings. Each piece in our collection is a testament 
                  to our commitment to quality, craftsmanship, and timeless design.
                </p>
                <p>
                  Our artisans combine traditional techniques passed down through generations with 
                  modern innovation, ensuring every creation meets the highest standards of excellence.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=800&auto=format&fit=crop" 
                alt="Jewellery craftsmanship" 
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
                <p className="text-4xl font-serif font-bold">40+</p>
                <p className="text-sm">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-accent/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-secondary mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Gem,
                title: 'Quality',
                description: 'Only the finest materials and gemstones make it into our collection.'
              },
              {
                icon: Award,
                title: 'Craftsmanship',
                description: 'Each piece is handcrafted by skilled artisans with decades of experience.'
              },
              {
                icon: Shield,
                title: 'Authenticity',
                description: 'Every item comes with certification and lifetime authenticity guarantee.'
              },
              {
                icon: Heart,
                title: 'Customer Care',
                description: 'We build lasting relationships with personalized service and support.'
              }
            ].map((value) => (
              <div key={value.title} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <value.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-secondary mb-2">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-center text-secondary mb-4">
            Meet Our Team
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The passionate individuals behind every masterpiece
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                name: 'Priya Aradhya',
                role: 'Creative Director',
                image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop'
              },
              {
                name: 'Vikram Mehta',
                role: 'Master Craftsman',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop'
              },
              {
                name: 'Ananya Shah',
                role: 'Design Lead',
                image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop'
              }
            ].map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative mb-4 overflow-hidden rounded-lg aspect-square">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold text-secondary">{member.name}</h3>
                <p className="text-primary text-sm">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Experience the Aradhya Difference
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Discover our collection of handcrafted jewellery, each piece telling its own unique story.
          </p>
          <Link to="/shop">
            <Button size="lg">
              Explore Collection
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
