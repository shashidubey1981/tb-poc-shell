'use client'

import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import Personalize from '@contentstack/personalize-edge-sdk'
import { Sdk } from '@contentstack/personalize-edge-sdk/dist/sdk'
import { Common } from '@/types'

const personalizeConfiguration: Common.PersonalizeConfig = {
    uid: '',
    audiences: {},
    taxonomy_path: ''
}

// Create a context that captures the initialized state, personalization SDK instance, and personalizeConfig
const PersonalizationContext = createContext({
    isInitialized: false,
    personalizationSDK: undefined as Sdk | undefined,
    personalizeConfig: personalizeConfiguration
})

// Create a hook to use the Personalization context
export const usePersonalization = () => {
    return useContext(PersonalizationContext)
}

// Create a provider component to wrap the application with the Personalization context
export const PersonalizationProvider = ({ 
    children, 
    personalizeConfig: serverPersonalizeConfig 
}: { 
    children: ReactNode
    personalizeConfig?: Common.PersonalizeConfig
}) => {

    const [isInitialized, setIsInitialized] = useState<boolean>(false)

    const [personalizationSDK, setPersonalizationSDK] = useState<Sdk | undefined>()

    // Use server-provided config if available, otherwise use default
    const personalizeConfig = serverPersonalizeConfig || personalizeConfiguration

    const initializePersonalizationSDK = async () => {
        try {
            // validates whether the CONTENTSTACK_PERSONALIZE_PROJECT_UID are present in .env.local file
            if (!process.env.CONTENTSTACK_PERSONALIZE_PROJECT_UID) {
                throw Error('PERSONALIZATION_PROJECT_UID not found')
            }
            
            // validates whether the CONTENTSTACK_PERSONALIZE_EDGE_API_URL are present in .env.local file and sets the edge api url
            // if not present, the default edge api url will be used
            // example: Personalize.setEdgeApiUrl('https://eu-personalize-edge.contentstack.com');
            if (process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL) {
                Personalize.setEdgeApiUrl(process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL)
            }
            
            // initializes the personalize SDK with the project UID
            const personalize = await Personalize.init(
                process.env.CONTENTSTACK_PERSONALIZE_PROJECT_UID
            )

            // sets the personalize SDK instance in the state
            setPersonalizationSDK(personalize)
        }

        catch(e) {

            console.error({initError: e})

        }

    }

    useEffect(() => {
        initializePersonalizationSDK().then(() => {
            setIsInitialized(true)
        })
    }, [])

    return (
        // Provide the Personalization context with the initialization status, initalized personalization SDK instance, and personalizeConfig
        <PersonalizationContext.Provider
            value={{ isInitialized, personalizationSDK: personalizationSDK, personalizeConfig: personalizeConfig }}
        >
            {isInitialized && children}
        </PersonalizationContext.Provider>
    )
}