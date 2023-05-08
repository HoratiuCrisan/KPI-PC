import { Card, CardContent, Typography, Stack, Avatar, SvgIcon, Grid} from '@mui/material'



const CardComponent = (props: any) => {
    const {sx, text, icon, value, color, money} = props
    return (
        <Card sx={{sx, bgcolor: "#fafafa"}} elevation={5} > 
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                <Stack spacing={1}>
                    <Typography
                        color="text.secondary"
                        variant="overline"
                        fontWeight={800}
                    >
                        {text}
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                        {money == true ? 
                            (value > 999 ? `$${value / 1000}k` : `${value}`)
                            : (value > 999 ? `${value / 1000}k` : `${value}`)
                        }
                        
                    </Typography>
                </Stack>
                <Avatar
                    sx={{
                        backgroundColor: color,
                        height: 56,
                        width: 56
                    }}
                    >
                        <SvgIcon>
                            {icon}
                        </SvgIcon>
                </Avatar>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default CardComponent
