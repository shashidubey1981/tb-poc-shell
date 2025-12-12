'use client'
import React, { useState } from 'react'
import { LivePreviewTypeMapper } from '@/types/common'

/**
 * Color Filter Option Type
 */
export interface ColorFilterOption {
  id?: string
  label?: string
  value?: string
  color?: string // Hex color code or CSS color name
}

/**
 * GuidedFilters Component Type
 */
export interface GuidedFilters {
  id?: string
  title?: string
  color_filters?: ColorFilterOption[]
  onFilterChange?: (selectedColors: string[]) => void
  className?: string
  component_name?: string
}

/**
 * Default color filter sets for initialization
 */
export const defaultColorFilterSet1: ColorFilterOption[] = [
  { id: 'red', label: 'Red', value: 'red', color: '#EF4444' },
  { id: 'blue', label: 'Blue', value: 'blue', color: '#3B82F6' },
  { id: 'green', label: 'Green', value: 'green', color: '#10B981' },
  { id: 'yellow', label: 'Yellow', value: 'yellow', color: '#F59E0B' },
  { id: 'purple', label: 'Purple', value: 'purple', color: '#8B5CF6' }
]

export const defaultColorFilterSet2: ColorFilterOption[] = [
  { id: 'black', label: 'Black', value: 'black', color: '#000000' },
  { id: 'white', label: 'White', value: 'white', color: '#FFFFFF' },
  { id: 'gray', label: 'Gray', value: 'gray', color: '#6B7280' },
  { id: 'pink', label: 'Pink', value: 'pink', color: '#EC4899' },
  { id: 'orange', label: 'Orange', value: 'orange', color: '#F97316' },
  { id: 'teal', label: 'Teal', value: 'teal', color: '#14B8A6' }
]

/**
 * GuidedFilters Component
 * 
 * A React component that displays guided filters with color filtering functionality.
 * Users can select multiple colors to filter content.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.$ - Optional object containing data-cslp attributes
 * @param {string} props.id - Unique identifier for the component
 * @param {string} props.title - Title/heading for the filter section
 * @param {Array} props.color_filters - Array of color filter options
 * @param {Function} props.onFilterChange - Callback function when filters change
 * @param {string} props.className - Additional CSS classes
 * 
 * @returns {React.ReactElement} A guided filters section with color filtering
 */
const GuidedFilters: React.FC<GuidedFilters> = (props: GuidedFilters) => {
  // Select default color filter set based on api_component prop
  // If api_component === "page", use defaultColorFilterSet1, otherwise use defaultColorFilterSet2
  const defaultColorFilters = props.component_name === 'guided_filter' 
    ? defaultColorFilterSet1 
    : defaultColorFilterSet2

  // Initialize with default values
  const defaultProps: Partial<GuidedFilters> = {
    title: 'Filter by Color',
    color_filters: defaultColorFilters,
    className: ''
  }

  // Merge provided props with defaults
  const mergedProps = {
    ...defaultProps,
    ...props,
    color_filters: props.color_filters && props.color_filters.length > 0 
      ? props.color_filters 
      : defaultColorFilters
  }

  const { $, id, title, color_filters = defaultColorFilters, onFilterChange, className = '' } = mergedProps
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  /**
   * Toggle color selection
   */
  const toggleColor = (colorValue: string) => {
    const newSelectedColors = selectedColors.includes(colorValue)
      ? selectedColors.filter(c => c !== colorValue)
      : [...selectedColors, colorValue]
    
    setSelectedColors(newSelectedColors)
    
    // Call the callback if provided
    if (onFilterChange) {
      onFilterChange(newSelectedColors)
    }
  }

  /**
   * Clear all selected filters
   */
  const clearFilters = () => {
    setSelectedColors([])
    if (onFilterChange) {
      onFilterChange([])
    }
  }

  return (
    <div
      id={id}
      className={`mx-[2.25rem] md:mx-[5.25rem] mb-25 my-25`}
      {...$?.title}
    >
      {title && (
        <h3
          className="text-2xl md:text-3xl font-semibold mb-6 text-stone"
          {...$?.title}
          data-id="h3-text"
        >
          {title}
        </h3>
      )}

      {color_filters && color_filters.length > 0 && (
        <div className="color-filters-wrapper">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {color_filters.map((filter, index) => {
              const isSelected = selectedColors.includes(filter.value || '')
              const colorValue = filter.color || filter.value || '#000000'
              
              return (
                <button
                  key={filter.id || index}
                  type="button"
                  onClick={() => toggleColor(filter.value || '')}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-200
                    ${isSelected 
                      ? 'border-stone bg-stone/10 shadow-md' 
                      : 'border-gray-300 bg-white hover:border-stone/50'
                    }
                  `}
                  aria-label={`Filter by ${filter.label || filter.value}`}
                  aria-pressed={isSelected}
                >
                  {/* Color Swatch */}
                  <span
                    className="w-6 h-6 rounded-full border-2 border-gray-200 flex-shrink-0"
                    style={{ backgroundColor: colorValue }}
                    aria-hidden="true"
                  />
                  
                  {/* Label */}
                  {filter.label && (
                    <span 
                      className="text-sm md:text-base font-medium text-stone"
                      {...filter.$?.label}
                    >
                      {filter.label}
                    </span>
                  )}
                  
                  {/* Selected Indicator */}
                  {isSelected && (
                    <span
                      className="absolute -top-1 -right-1 w-5 h-5 bg-stone rounded-full flex items-center justify-center"
                      aria-hidden="true"
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {/* Clear Filters Button */}
          {selectedColors.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-stone underline transition-colors duration-200"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {(!color_filters || color_filters.length === 0) && (
        <p className="text-gray-500 text-sm">No color filters available</p>
      )}
    </div>
  )
}

export { GuidedFilters }

