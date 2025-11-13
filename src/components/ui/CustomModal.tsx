import React from 'react'
import { Dialog, IconButton, Slide, useMediaQuery, useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { type TransitionProps } from '@mui/material/transitions'
import clsx from 'clsx'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

type CustomModalProps = {
  isOpen: boolean
  onClose: () => void
  children?: React.ReactNode
  variant?: 'default' | 'auth'
  mainClassName?: string
  containerClassName?: string
  width?: string
  height?: string
  closable?: boolean
  isclosable?: boolean
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onClose,
  children,
  variant = 'default',
  mainClassName = '',
  containerClassName = '',
  width,
  height,
  closable = true,
  isclosable = true,
}) => {
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const shouldUseFullScreen = (!width && !height) || isSmallScreen

  const handleClose = (_event: object, reason: string) => {
    if (closable && reason !== 'backdropClick') {
      onClose()
    }
  }

  return (
    <Dialog
      open={isOpen}
      onClose={closable ? handleClose : undefined}
      fullScreen={shouldUseFullScreen}
      maxWidth={false}
      PaperProps={{
        style: {
          width: shouldUseFullScreen ? '100%' : width || '100%',
          height: shouldUseFullScreen ? '100%' : height || '100%',
          maxWidth: shouldUseFullScreen ? '100%' : width || '100%',
          maxHeight: shouldUseFullScreen ? '100%' : height || '100%',
        },
      }}
      slots={{
        transition: Transition,
      }}
    >
      {isclosable && (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 15,
            top: 8,
            zIndex: 50,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      )}

      {variant === 'auth' ? (
        <main
          className={clsx(
            'grid grid-cols-1 md:grid-cols-2 h-full overflow-auto',
            mainClassName
          )}
        >
          {children}
        </main>
      ) : (
        <main
          className={clsx(
            'flex justify-center items-start overflow-auto h-full',
            mainClassName
          )}
        >
          <div
            className={clsx(
              'w-full flex flex-col gap-5 p-6',
              containerClassName
            )}
          >
            {children}
          </div>
        </main>
      )}
    </Dialog>
  )
}

export default CustomModal
