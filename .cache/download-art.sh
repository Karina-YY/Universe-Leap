#!/bin/sh
set -eu

mkdir -p assets/art/backgrounds
mkdir -p assets/art/components/images
mkdir -p assets/art/reference

lark-cli docs +media-download --as user --token "Yx4qbQ4N0oekYqxLVYicC8uTnsc" --output "assets/art/components/images/bagel_pixel.png" --overwrite
lark-cli docs +media-download --as user --token "FD6xbIPDaoqpsZxrCyVcBul2nLd" --output "assets/art/components/images/stone_sprite.png" --overwrite
lark-cli docs +media-download --as user --token "S6A8bCY2pomfZwxxu5vcaR2qnWf" --output "assets/art/components/images/coin_matrix_demo.png" --overwrite
lark-cli docs +media-download --as user --token "TSfDbesMfomf8RxZI9Oc1EHNnad" --output "assets/art/components/images/blue_diamond_fragment.png" --overwrite
lark-cli docs +media-download --as user --token "I8nmb0muwoBgRBxwOyJcl7axnPf" --output "assets/art/components/images/evelyn_classic_front.png" --overwrite
lark-cli docs +media-download --as user --token "CMP3bKVSDoHw3lx6hyucCIVOn6I" --output "assets/art/components/images/evelyn_hotdog_hand.png" --overwrite
lark-cli docs +media-download --as user --token "QOK6bCG6yoYKjbxuAp5c11yqnNh" --output "assets/art/components/images/evelyn_kungfu.png" --overwrite
lark-cli docs +media-download --as user --token "SekebDCe6ofdX8xbbABc5lO2nKe" --output "assets/art/components/images/trophy_pixel.png" --overwrite
lark-cli docs +media-download --as user --token "GotWbTXGxoj1b2xNJ4VcpKkGnve" --output "assets/art/components/images/hotdog_hand_pixel.png" --overwrite

lark-cli docs +media-download --as user --token "Ri8Obhwy4oqhdkxSYRqcF1jxnNe" --output "assets/art/backgrounds/bg_universe_stone.png" --overwrite
lark-cli docs +media-download --as user --token "XfglbUcGXotLjUx2cIEcauNUnhd" --output "assets/art/backgrounds/bg_universe_laundromat.png" --overwrite
lark-cli docs +media-download --as user --token "ZVsBbddhtoEN4zxtDd3cfQa0nHh" --output "assets/art/backgrounds/bg_universe_hotdog.png" --overwrite
lark-cli docs +media-download --as user --token "XUGSbhtpNo3hnxx5h3Acyl9tnu1" --output "assets/art/backgrounds/bg_universe_kungfu.png" --overwrite
