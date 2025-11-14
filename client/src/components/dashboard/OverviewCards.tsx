import { Box, Card, CardContent, Typography } from '@mui/material';

interface OverviewCardsProps {
  stats: { label: string; value: string; delta?: string }[];
}

const OverviewCards = ({ stats }: OverviewCardsProps) => (
  <Box
    sx={{
      display: 'grid',
      gap: 3,
      gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
    }}
  >
    {stats.map((stat) => (
      <Card key={stat.label} variant="outlined">
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {stat.label}
          </Typography>
          <Typography variant="h4" color="text.primary">
            {stat.value}
          </Typography>
          {stat.delta && (
            <Typography variant="caption" color="success.main">
              +{stat.delta} vs last week
            </Typography>
          )}
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default OverviewCards;

