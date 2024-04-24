=begin
File: preorder_traversal_ii_compact.rb
Created Time: 2024-04-07
Author: hoangtien2k3 (hoangtien2k3qx1@gmail.com)
=end

require_relative 'utils'

# 前序遍历：例题二
def pre_order(root)
  return if root.nil?

  # 尝试
  $path << root
  if root.val == 7
    # 记录解
    $res << $path.dup
  end

  pre_order(root.left)
  pre_order(root.right)

  # 回退
  $path.pop
end

root = TreeNode.list_to_tree([1, 7, 3, 4, 5, 6, 7])
puts "\n初始化二叉树"
PrintUtil.print_tree(root)

# 前序遍历
$path = []
$res = []
pre_order(root)

puts "\n输出所有根节点到节点 7 的路径"
$res.each do |path|
  vals = []
  path.each { |node| vals << node.val }
  puts vals
end
