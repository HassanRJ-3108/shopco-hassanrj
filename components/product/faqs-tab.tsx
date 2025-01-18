'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FAQ } from "@/types/product"

interface FAQsTabProps {
  faqs: FAQ[]
}

export function FAQsTab({ faqs }: FAQsTabProps) {
  if (!faqs?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No FAQs available for this product.
      </div>
    )
  }

  return (
    <div className="max-w-7xl">
      <h2 className="text-2xl font-semibold mb-6">Frequently asked questions</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <div className="pt-4 px-1">
                {faq.answer}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}