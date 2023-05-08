import { Card, CardContent, CardHeader, Stack, Typography} from "@mui/material"

const UserCards = (props: any) => {
    const {sx, text, value} = props
    return (
        <Card sx={{sx, bgcolor: "#38bdf8"}} elevation={5} > 
            <CardContent>
                <Stack
                    alignItems="flex-center"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                <Stack spacing={1}>
                    <Typography
                        align="center"
                        color="white"
                        variant="h6"
                        fontWeight={600}
                    >
                        {text}
                    </Typography>
                    <Typography
                        color="white"
                        variant="h4"
                        fontWeight={800}
                    >
                        {value}
                    </Typography>
                </Stack>
                </Stack>
            </CardContent>
        </Card>
    )
}

export default UserCards