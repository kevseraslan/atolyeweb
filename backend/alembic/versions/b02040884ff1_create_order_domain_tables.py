"""create order domain tables

Revision ID: b02040884ff1
Revises: 361a597ad4d4
Create Date: 2026-08-29 19:57:06.172992

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b02040884ff1'
down_revision: Union[str, Sequence[str], None] = '361a597ad4d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('orders',
    sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), sa.Identity(always=False), autoincrement=True, nullable=False),
    sa.Column('tracking_number', sa.String(length=30), nullable=False),
    sa.Column('product_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=True),
    sa.Column('color_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=True),
    sa.Column('material_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=True),
    sa.Column('snapshot_product_name', sa.String(length=200), nullable=True),
    sa.Column('snapshot_color_name', sa.String(length=100), nullable=True),
    sa.Column('snapshot_material_name', sa.String(length=100), nullable=True),
    sa.Column('custom_product_name', sa.String(length=200), nullable=True),
    sa.Column('requested_width', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('requested_height', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('requested_depth', sa.Numeric(precision=10, scale=2), nullable=True),
    sa.Column('custom_note', sa.Text(), nullable=True),
    sa.Column('quantity', sa.Integer(), nullable=False),
    sa.Column('customer_name', sa.String(length=100), nullable=False),
    sa.Column('phone', sa.String(length=30), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=True),
    sa.Column('city', sa.String(length=50), nullable=False),
    sa.Column('status', sa.String(length=30), nullable=False),
    sa.Column('quoted_price', sa.Numeric(precision=12, scale=2), nullable=True),
    sa.Column('approved_price', sa.Numeric(precision=12, scale=2), nullable=True),
    sa.Column('quoted_at', sa.DateTime(timezone=True), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['color_id'], ['colors.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['material_id'], ['materials.id'], ondelete='SET NULL'),
    sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='SET NULL'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_orders_status_created', 'orders', ['status', 'created_at'], unique=False)
    op.create_index(op.f('ix_orders_color_id'), 'orders', ['color_id'], unique=False)
    op.create_index(op.f('ix_orders_material_id'), 'orders', ['material_id'], unique=False)
    op.create_index(op.f('ix_orders_phone'), 'orders', ['phone'], unique=False)
    op.create_index(op.f('ix_orders_product_id'), 'orders', ['product_id'], unique=False)
    op.create_index(op.f('ix_orders_status'), 'orders', ['status'], unique=False)
    op.create_index(op.f('ix_orders_tracking_number'), 'orders', ['tracking_number'], unique=True)

    op.create_table('order_status_history',
    sa.Column('id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), sa.Identity(always=False), autoincrement=True, nullable=False),
    sa.Column('order_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=False),
    sa.Column('old_status', sa.String(length=30), nullable=True),
    sa.Column('new_status', sa.String(length=30), nullable=False),
    sa.Column('changed_by_admin_id', sa.BigInteger().with_variant(sa.Integer(), 'sqlite'), nullable=True),
    sa.Column('note', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=False),
    sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_order_status_history_order_id'), 'order_status_history', ['order_id'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f('ix_order_status_history_order_id'), table_name='order_status_history')
    op.drop_table('order_status_history')
    op.drop_index(op.f('ix_orders_tracking_number'), table_name='orders')
    op.drop_index(op.f('ix_orders_status'), table_name='orders')
    op.drop_index(op.f('ix_orders_product_id'), table_name='orders')
    op.drop_index(op.f('ix_orders_phone'), table_name='orders')
    op.drop_index(op.f('ix_orders_material_id'), table_name='orders')
    op.drop_index(op.f('ix_orders_color_id'), table_name='orders')
    op.drop_index('idx_orders_status_created', table_name='orders')
    op.drop_table('orders')
