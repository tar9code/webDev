<?php
class payment {
	var $first;
	var $last;
	var $card;
	var $type;
	var $expireMonth;
	var $expireYear;
	var $security;
	function payment($first, $last, $card, $type, $month, $year, $security)
	{
		$this->$first = $first;
		$this->$last = $last;
		$this->$card = $card;
		$this->$type = $type;
		$this->$expireMonth = $month;
		$this->$expireYear = $year;
		$this->$security = $security;
	}
}
class info {
	var $first;
	var $last;
	var $address;
	var $city;
	var $state;
	var $zip;
	var $address2;
	var $city2;
	var $state2;
	var $zip2;
	var $email;
	var $phone;
	
	function info($first, $last, $address, $city, $state, $zip, $email)
	{
		$this->first = $first;
		$this->last = $last;
		$this->address = $address;
		$this->city = $city;
		$this->state = $state;
		$this->zip = $zip;
		$this->email = $email;
	}
	function addBilling($address, $city, $state, $zip)
	{
		$this->address2 = $address;
		$this->city2 = $city;
		$this->state2 = $state;
		$this->zip2 = $zip;
	}
	function addPhone($phone)
	{
		$this->phone = $phone;
	}
}
class book {
    var $code;
    var $title;
    var $author;
    var $quantity;
    var $price;

    function book($code, $title, $author, $quantity, $price)
    {
        $this->code = $code;
        $this->title = $title;
        $this->author = $author;
        $this->quantity = $quantity;
        $this->price = $price;
    }
}

function show_table($session_cart, $checkout)
    {
        $html = '<table>';

        $html .= '<tr>';
        
		if (count($session_cart) == 0)
            return false;

        $html .= '<th>Item</th><th>Title</th><th>Author</th><th>Quantity</th><th>Price</th><th>Cost</th><th></th>';
        $html .= '</tr>';

        $total = 0;
		$rowNum = 0;
		$image = "";
        // data rows
        foreach($session_cart as $item)
        {
            $cost = $item->price * $item->quantity;
            $total += $cost;
			$cost = number_format((float)$cost, 2, '.', '');
			$image = "http://csweb01.csueastbay.edu/~mn3487/Project1/Images/product";
			$image .= $item->code;
			$image .= ".jpg";
            $html .= '<tr>';
			$html .= '<td><img src="'.$image.'" width="50" height="50"></td>';
            $html .= '<td>'.$item->title.'</td>';
            $html .= '<td>'.$item->author.'</td>';
            $html .= '<td>'.$item->quantity.'</td>';
            $html .= '<td>'.$item->price.'</td>';
            $html .= '<td>'.$cost.'</td>';
			if ($checkout == 1)
			{
				$html .= '<td>
				<form action="cart.php" method="post">
					<input type="hidden" name="Desired_Action" value="Deleting">
					<input type="hidden" id="code" name="code" value="'.$item->code.'">
					<input type="submit" value="X">
				</form></td>';
			}
			else
			{
				$html .= '<td></td>';
			}
            $html .= '</tr>';
			$rowNum += 1;
        }
		$tax = $total * 0.08;
		$taxD = number_format((float)$tax, 2, '.', '');
		$shipping = 2.00;
		$shipping = number_format((float)$shipping, 2, '.', '');
		$html .= '<tr><td></td><td></td><td></td><td></td><td>Subtotal</td><td>'.$total.'</td>';
		
		$total += $tax + $shipping;
		$totalD = number_format((float)$total, 2, '.', '');
		$html .= '<tr><td></td><td></td><td></td><td></td><td>Tax(8%)</td><td>'.$taxD.'</td>';
		$html .= '<tr><td></td><td></td><td></td><td></td><td>Shipping</td><td>'.$shipping.'</td>';
        $html .= '<tr><td></td><td></td><td></td><td></td><td>Total</td><td>'.$totalD.'</td>';
		
		if ($checkout == 1)
		{
			$html .= '<tr><td></td><td></td><td></td><td></td><td>Total</td>
			<td>
			<form action="userInfo.php" method="post">
				<input type="hidden" name="Desired_Action" value="Submit">
				<input type="submit" value="Checkout">
			</form>
			</td>';
		}
		
        $html .= '</table>';
        echo $html;
        return true;
    }
?>