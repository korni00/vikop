import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Card, CardDescription, CardTitle } from "./card";

const PromoCard = () => {
  return (
    <Card
      style={{
        backgroundImage:
          "url(https://wykop.pl/cdn/7c4cda5db7d1493f05c7-4b44df189463bab1b45cced887282d0b/4489c9fc4058e68796b2f7f12146decb4d3c420892a4571a3ecfd227c831642f,w1260.png)",
      }}
      className="flex flex-col items-start space-y-4 p-4"
    >
      <Avatar>
        <AvatarImage alt="Avatar" src="/placeholder.svg?height=100&width=100" />
        <AvatarFallback>AF</AvatarFallback>
      </Avatar>
      <CardTitle>John Doe</CardTitle>
      <CardDescription>Software Engineer</CardDescription>
      <Button variant="default">View Profile</Button>
    </Card>
  );
};

export default PromoCard;
