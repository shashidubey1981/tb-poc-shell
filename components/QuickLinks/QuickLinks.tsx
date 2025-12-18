'use client'
import React from 'react'
import { QuickLinks as QuickLinksProps } from '@/types/components'
import { useWebConfigContext } from '@/context'


/**
 * Quick Links coming from API/ Third party vendors
 */

const quickLinksCategoriesFromApi: QuickLinksProps = {
    id: 'quick-links',
    title: 'Quick Links',
    items: [
        {
            link_text: 'Link 1',
            link: '/',
        },
    ]
}


/**
 * Quick Links Component
 *
 * A React component that displays quick links with click functionality.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.$ - Optional object containing data-cslp attributes
 * @param {string} props.id - Unique identifier for the component
 * @param {string} props.title - Title/heading for the filter section
 * @param {Array} props.quickLinksCategories - Array of quick link categories
 * @param {Function} props.onLinkClick - Callback function when a link is clicked
 * @param {string} props.className - Additional CSS classes
 *
 * @returns {React.ReactElement} A quick links section with click functionality
 */
const QuickLinks: React.FC<QuickLinksProps> = (props: QuickLinksProps): JSX.Element => {
    const { items, title, id, $ , slug } = props
    const slugParentCategory = props.slug?.[0]
    const slugSubCategory = props.slug?.[1]
    const categoriesSourcefromCMS = props.items
    const { webConfig } = useWebConfigContext()
    return (
        <div id={id} className="mx-[2.25rem] md:mx-[5.25rem] my-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-stone">
                {title ?? title}
            </h2>

            {categoriesSourcefromCMS && (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                        {categoriesSourcefromCMS.map(entry => {
                            return (
                                <button
                                    key={entry.link_text}
                                    type="button"
                                    onClick={() => window.open(entry.link, '_blank')}
                                    className={`
                                        relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200
                                    `}
                                    aria-label={entry.link_text}
                                >

                                    <span className="text-sm md:text-base font-medium text-stone">
                                        {entry.link_text}
                                    </span>

                                </button>
                            )
                        })}
                    </div>


                </div>
            )}
        </div>
    )
}

export {QuickLinks}

