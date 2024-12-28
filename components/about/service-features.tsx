import { Truck, Headphones, Shield } from 'lucide-react'

export default function ServiceFeatures() {
  return (
    <section className="w-full max-w-[1170px] mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Delivery */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#2F2E30] flex items-center justify-center mb-6">
            <div className="w-[80px] h-[80px] rounded-full bg-[#2F2E30] flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-black flex items-center justify-center">
                <Truck className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-[20px] font-semibold mb-2">FREE AND FAST DELIVERY</h3>
          <p className="text-sm text-muted-foreground">
            Free delivery for all orders over $140
          </p>
        </div>

        {/* Customer Service */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#2F2E30] flex items-center justify-center mb-6">
            <div className="w-[80px] h-[80px] rounded-full bg-[#2F2E30] flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-black flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-[20px] font-semibold mb-2">24/7 CUSTOMER SERVICE</h3>
          <p className="text-sm text-muted-foreground">
            Friendly 24/7 customer support
          </p>
        </div>

        {/* Money Back Guarantee */}
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#2F2E30] flex items-center justify-center mb-6">
            <div className="w-[80px] h-[80px] rounded-full bg-[#2F2E30] flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-black flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h3 className="text-[20px] font-semibold mb-2">MONEY BACK GUARANTEE</h3>
          <p className="text-sm text-muted-foreground">
            We return money within 30 days
          </p>
        </div>
      </div>
    </section>
  )
}

