import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { VerticalItems } from 'src/configs/layout'
import IconifyIcon from 'src/components/Icon'

type TProps = {
  open: boolean
}

const RecursiveListItems = ({
  disabled,
  items,
  level,
  openItem,
  setOpenItem
}: {
  disabled: boolean
  items: any
  level: number
  openItem: { [key: string]: boolean }
  setOpenItem: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>
}) => {
  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItem(prev => ({
        ...prev,
        [title]: !prev[title]
      }))
    }
  }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <React.Fragment key={item.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * 20}px`
              }}
              onClick={() => {
                if (item.children) {
                  handleClick(item.title)
                }
              }}
            >
              <ListItemIcon>
                <IconifyIcon icon={item.icon} />
              </ListItemIcon>

              {!disabled && <ListItemText primary={item?.title} />}
              {item.children && item.children.length > 0 && (
                <>
                  {openItem[item.title] ? (
                    <IconifyIcon icon='ic:sharp-expand-more' />
                  ) : (
                    <IconifyIcon icon='ic:sharp-expand-less' />
                  )}
                </>
              )}
            </ListItemButton>
            {item.children && item.children.length > 0 && (
              <>
                <Collapse in={openItem[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveListItems
                    disabled={disabled}
                    items={item.children}
                    level={level + 1}
                    openItem={openItem}
                    setOpenItem={setOpenItem}
                  />
                </Collapse>
              </>
            )}
          </React.Fragment>
        )
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  const [openItem, setOpenItem] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (!open) {
      handleToggleAll()
    }
  }, [open])

  const handleToggleAll = () => {
    setOpenItem({})
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveListItems
        disabled={!open}
        items={VerticalItems}
        level={1}
        openItem={openItem}
        setOpenItem={setOpenItem}
      />
    </List>
  )
}

export default ListVerticalLayout
