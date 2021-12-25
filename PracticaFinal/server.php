<?php
  //Apple DB
  $db = mysqli_connect("localhost", "root", "", "apple_db"); //conexion con DB
  if (!$db) {
    die("Connection failed: " . mysqli_connect_error());
  }

  //stocks
  $query = mysqli_query($db,"SELECT * FROM apple_stock"); // SELECT de toda la tabla
  $stock = mysqli_fetch_all($query, MYSQLI_NUM); //fetch toda la tabla

  //iphone se reviews
  $query = mysqli_query($db,"SELECT ratings FROM apple_iphone_reviews"); // SELECT de ratings
  $reviews = mysqli_fetch_all($query, MYSQLI_NUM);

  //app store vs play store
  $query = mysqli_query($db,"SELECT price FROM app_store"); // SELECT del precio
  $appstore = mysqli_fetch_all($query, MYSQLI_NUM);
  $query = mysqli_query($db,"SELECT price FROM play_store"); // SELECT del precio
  $playstore = mysqli_fetch_all($query, MYSQLI_NUM);

  //iphone 11 mapa de precios
  $query = mysqli_query($db,"SELECT Prices FROM iphone_mapa"); // SELECT de toda la tabla
  $mapa = mysqli_fetch_all($query, MYSQLI_NUM);

  //Return JSON (combinar todo en un array clave-valor)
  $data = [
    "stock" => $stock,
    "reviews" => $reviews,
    "appstore" => $appstore,
    "playstore" => $playstore,
    "mapa" => $mapa
  ];
  echo json_encode($data); //codificar en JSON
