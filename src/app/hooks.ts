/**
 * Pre-typed versions of the standard react-redux hooks.
 *
 * Use these instead of the plain `useDispatch` / `useSelector` so you get
 * full TypeScript inference tied to this app's store shape.
 *
 * Usage:
 *   const dispatch = useAppDispatch()
 *   const events   = useAppSelector((state) => state.migraine.events)
 */
import { useDispatch, useSelector } from 'react-redux'

import type { AppDispatch, RootState } from './store'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector = <T>(selector: (state: RootState) => T): T =>
  useSelector(selector)
